package com.wellness.management.service;

import com.wellness.management.model.Schedule;
import com.wellness.management.model.User;
import com.wellness.management.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduleService {
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }
    
    public List<Schedule> getSchedulesByTeacher(User teacher) {
        return scheduleRepository.findByTeacher(teacher);
    }
    
    public List<Schedule> getSchedulesByStudent(User student) {
        return scheduleRepository.findByStudent(student);
    }
    
    public List<Schedule> getSchedulesByDateRange(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByScheduleDateTimeBetween(start, end);
    }
    
    public Schedule updateAttendance(Long id, boolean attended) {
        Schedule schedule = scheduleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setAttended(attended);
        return scheduleRepository.save(schedule);
    }
}