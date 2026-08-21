package com.vit.semesterresult.controller;

import com.vit.semesterresult.model.StudentResult;
import com.vit.semesterresult.repository.StudentResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
public class ResultController {

    @Autowired
    private StudentResultRepository repository;

    private static final String[] SUBJECTS = {"Ethical Hacking", "Computer Networks", "Design & Analysis of Algorithms", "Web Technology"};

    @GetMapping("/")
    public String index() {
        return "index"; // resolves to src/main/resources/templates/index.html (Thymeleaf)
    }

    @PostMapping("/submit")
    public String submitResult(@RequestParam("studentName") String studentName,
                               @RequestParam Map<String, String> allParams,
                               Model model) {
        Map<String, double[]> marks = new HashMap<>();
        for (String subject : SUBJECTS) {
            String mseKey = subject.replaceAll(" ", "_") + "_MSE";
            String eseKey = subject.replaceAll(" ", "_") + "_ESE";
            double mse = Double.parseDouble(allParams.getOrDefault(mseKey, "0"));
            double ese = Double.parseDouble(allParams.getOrDefault(eseKey, "0"));
            marks.put(subject, new double[]{mse, ese});
        }
        StudentResult result = new StudentResult(studentName, marks);
        repository.save(result);
        model.addAttribute("student", result);
        return "result"; // shows result page
    }
}
