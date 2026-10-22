package com.cricket.cricketScore.service;

import com.cricket.cricketScore.model.BallUpdate;
import com.cricket.cricketScore.model.Match;
import com.cricket.cricketScore.model.MatchStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class MatchSimulatorService {

    private final MatchService matchService;
    private final Random random = new Random();

    @Scheduled(fixedRate = 3000) // Simulate a ball every 3 seconds
    public void simulateLiveMatches() {
        List<Match> matches = matchService.getAllMatches();

        for (Match match : matches) {
            if (match.getStatus() == MatchStatus.IN_PROGRESS || match.getStatus() == MatchStatus.SCHEDULED) {

                boolean isTeamA = match.getCurrentInningsTeam().equals(match.getTeamA());
                double currentOver = isTeamA ? match.getOversTeamA() : match.getOversTeamB();

                // Calculate over progression (0.1, 0.2 ... 0.5 -> 1.0)
                int balls = (int) Math.round((currentOver % 1) * 10);
                int overNumber = (int) currentOver;

                balls++;
                if (balls >= 6) {
                    overNumber++;
                    balls = 0;
                }
                double nextOver = overNumber + (balls / 10.0);

                int runs = random.nextInt(7); // 0 to 6 runs
                boolean isWicket = (runs == 5 && random.nextBoolean()); // Occasional wicket
                if (isWicket) runs = 0;

                BallUpdate update = BallUpdate.builder()
                        .matchId(match.getId())
                        .batsman("Player " + (random.nextInt(11) + 1))
                        .bowler("Bowler " + (random.nextInt(5) + 1))
                        .runsScored(runs)
                        .isWicket(isWicket)
                        .wicketType(isWicket ? "Caught" : null)
                        .currentOver(nextOver)
                        .commentary(isWicket ? "WICKET! Great catch in the deep." : runs + " run(s) scored.")
                        .build();

                matchService.processBallUpdate(update);
            }
        }
    }
}