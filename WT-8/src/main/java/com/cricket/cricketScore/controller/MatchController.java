package com.cricket.cricketScore.controller;

import com.cricket.cricketScore.model.BallUpdate;
import com.cricket.cricketScore.model.Match;
import com.cricket.cricketScore.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<Match> createMatch(@RequestParam String teamA, @RequestParam String teamB) {
        return ResponseEntity.ok(matchService.createMatch(teamA, teamB));
    }

    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping("/ball")
    public ResponseEntity<String> recordBallUpdate(@RequestBody BallUpdate update) {
        matchService.processBallUpdate(update);
        return ResponseEntity.ok("Ball update processed successfully.");
    }
}