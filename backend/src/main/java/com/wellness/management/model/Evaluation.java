package com.wellness.management.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "evaluations")
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    private LocalDateTime evaluationDate;
    
    private Double bmi;
    
    private Double bioimpedance;
    
    @Column(nullable = false)
    private Integer painLevel; // 0-10 scale
    
    private String painLocation;
    
    private String notes;
}