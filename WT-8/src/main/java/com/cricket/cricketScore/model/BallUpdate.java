package com.cricket.cricketScore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BallUpdate implements Serializable {
    private Long matchId;
    private String batsman;
    private String bowler;
    private int runsScored;
    private boolean isWicket;
    private String wicketType;
    private double currentOver;
    private int totalRuns;
    private int totalWickets;
    private String commentary;
}