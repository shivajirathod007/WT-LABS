package com.vit.semesterresult.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "student_results")
public class StudentResult {
    @Id
    private String id;
    private String studentName;
    // key: subject name, value: array[0]=MSE, [1]=ESE
    private Map<String, double[]> marks;
    private double totalScore;

    public StudentResult() {}

    public StudentResult(String studentName, Map<String, double[]> marks) {
        this.studentName = studentName;
        this.marks = marks;
        computeTotal();
    }

    private void computeTotal() {
        double sum = 0.0;
        for (double[] arr : marks.values()) {
            double mse = arr[0];
            double ese = arr[1];
            sum += mse * 0.30 + ese * 0.70;
        }
        this.totalScore = sum;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public Map<String, double[]> getMarks() { return marks; }
    public void setMarks(Map<String, double[]> marks) { this.marks = marks; computeTotal(); }
    public double getTotalScore() { return totalScore; }
}
