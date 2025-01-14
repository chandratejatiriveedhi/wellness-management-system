package com.wellness.management.repository;

import com.wellness.management.model.Evaluation;
import com.wellness.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByStudent(User student);
    List<Evaluation> findByStudentOrderByEvaluationDateDesc(User student);
}