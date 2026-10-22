package com.cricket.cricketScore.service;

import com.cricket.cricketScore.model.BallUpdate;
import com.cricket.cricketScore.model.Match;
import com.cricket.cricketScore.model.MatchStatus;
import com.cricket.cricketScore.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Match createMatch(String teamA, String teamB) {
        Match match = Match.builder()
                .teamA(teamA)
                .teamB(teamB)
                .scoreTeamA(0)
                .wicketsTeamA(0)
                .oversTeamA(0.0)
                .scoreTeamB(0)
                .wicketsTeamB(0)
                .oversTeamB(0.0)
                .currentInningsTeam(teamA)
                .status(MatchStatus.SCHEDULED)
                .build();
        return matchRepository.save(match);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Match getMatchById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with ID: " + id));
    }

    @Transactional
    public void processBallUpdate(BallUpdate update) {
        Match match = getMatchById(update.getMatchId());

        if (match.getStatus() == MatchStatus.COMPLETED) {
            return;
        }

        if (match.getStatus() == MatchStatus.SCHEDULED) {
            match.setStatus(MatchStatus.IN_PROGRESS);
        }

        // Update active innings team score
        if (match.getCurrentInningsTeam().equals(match.getTeamA())) {
            match.setScoreTeamA(match.getScoreTeamA() + update.getRunsScored());
            if (update.isWicket()) {
                match.setWicketsTeamA(match.getWicketsTeamA() + 1);
            }
            match.setOversTeamA(update.getCurrentOver());

            update.setTotalRuns(match.getScoreTeamA());
            update.setTotalWickets(match.getWicketsTeamA());
        } else {
            match.setScoreTeamB(match.getScoreTeamB() + update.getRunsScored());
            if (update.isWicket()) {
                match.setWicketsTeamB(match.getWicketsTeamB() + 1);
            }
            match.setOversTeamB(update.getCurrentOver());

            update.setTotalRuns(match.getScoreTeamB());
            update.setTotalWickets(match.getWicketsTeamB());
        }

        // Check Innings or Match End Conditions (Simple 20 Over or 10 Wickets logic)
        if (update.getTotalWickets() >= 10 || update.getCurrentOver() >= 20.0) {
            if (match.getCurrentInningsTeam().equals(match.getTeamA())) {
                match.setCurrentInningsTeam(match.getTeamB());
            } else {
                match.setStatus(MatchStatus.COMPLETED);
                match.setWinner(match.getScoreTeamA() > match.getScoreTeamB() ? match.getTeamA() : match.getTeamB());
            }
        }

        matchRepository.save(match);

        // Broadcast ball update via WebSocket STOMP topic
        messagingTemplate.convertAndSend("/topic/match/" + update.getMatchId(), update);
    }
}