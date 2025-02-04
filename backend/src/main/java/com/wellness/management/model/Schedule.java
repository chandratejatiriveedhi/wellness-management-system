package com.wellness.management.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;
    
    @Column(nullable = false)
    private String userId;  // ID of student/teacher/admin
    
    @Column(nullable = false)
    private String role;  // STUDENT, TEACHER, CLIENT, ADMIN

    private String notes;
}
