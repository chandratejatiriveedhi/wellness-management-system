package com.wellness.management.service;

import com.wellness.management.model.Schedule;
import com.wellness.management.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public List<Schedule> getSchedulesByDate(LocalDate date) {
        return scheduleRepository.findByDate(date);
    }

    public List<Schedule> getSchedulesByActivity(Long activityId) {
        return scheduleRepository.findByActivityId(activityId);
    }

    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id).orElse(null);
    }

    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Schedule updateSchedule(Long id, Schedule updatedSchedule) {
        if (scheduleRepository.existsById(id)) {
            updatedSchedule.setId(id);
            return scheduleRepository.save(updatedSchedule);
        }
        return null;
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}
