package com.cricket.cricketScore.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String teamA;
    private String teamB;

    private int scoreTeamA;
    private int wicketsTeamA;
    private double oversTeamA;

    private int scoreTeamB;
    private int wicketsTeamB;
    private double oversTeamB;

    private String currentInningsTeam;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    private String winner;
}