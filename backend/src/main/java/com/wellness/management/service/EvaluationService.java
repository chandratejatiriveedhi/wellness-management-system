package com.wellness.management.service;

import com.wellness.management.model.Evaluation;
import com.wellness.management.model.User;
import com.wellness.management.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService {
    @Autowired
    private EvaluationRepository evaluationRepository;
    
    public Evaluation createEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }
    
    public List<Evaluation> getStudentEvaluations(User student) {
        return evaluationRepository.findByStudentOrderByEvaluationDateDesc(student);
    }
    
    public Evaluation getLatestEvaluation(User student) {
        return evaluationRepository.findByStudentOrderByEvaluationDateDesc(student)
            .stream()
            .findFirst()
            .orElse(null);
    }
    
    public Evaluation updateEvaluation(Long id, Evaluation evaluationDetails) {
        Evaluation evaluation = evaluationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Evaluation not found"));
            
        evaluation.setBmi(evaluationDetails.getBmi());
        evaluation.setBioimpedance(evaluationDetails.getBioimpedance());
        evaluation.setPainLevel(evaluationDetails.getPainLevel());
        evaluation.setPainLocation(evaluationDetails.getPainLocation());
        evaluation.setNotes(evaluationDetails.getNotes());
        
        return evaluationRepository.save(evaluation);
    }
}