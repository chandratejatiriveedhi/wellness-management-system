package com.wellness.management.controller;

import com.wellness.management.model.Evaluation;
import com.wellness.management.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody Evaluation evaluation) {
        return ResponseEntity.ok(evaluationService.createEvaluation(evaluation));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Evaluation>> getStudentEvaluations(@PathVariable Long studentId) {
        // Implement student lookup
        return ResponseEntity.ok(evaluationService.getStudentEvaluations(null));
    }

    @GetMapping("/student/{studentId}/latest")
    public ResponseEntity<Evaluation> getLatestEvaluation(@PathVariable Long studentId) {
        // Implement student lookup
        return ResponseEntity.ok(evaluationService.getLatestEvaluation(null));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Evaluation> updateEvaluation(
            @PathVariable Long id,
            @RequestBody Evaluation evaluation) {
        return ResponseEntity.ok(evaluationService.updateEvaluation(id, evaluation));
    }
}