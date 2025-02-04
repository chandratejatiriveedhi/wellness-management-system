package com.wellness.management.repository;

import com.wellness.management.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDate(LocalDate date);
    List<Schedule> findByActivityId(Long activityId);
    List<Schedule> findByUserId(String userId);
    List<Schedule> findByDateAndActivityId(LocalDate date, Long activityId);
}
