package com.wellness.management.repository;

import com.wellness.management.model.Schedule;
import com.wellness.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByTeacher(User teacher);
    List<Schedule> findByStudent(User student);
    List<Schedule> findByScheduleDateTimeBetween(LocalDateTime start, LocalDateTime end);
}