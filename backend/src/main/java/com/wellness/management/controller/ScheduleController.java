package com.wellness.management.controller;

import com.wellness.management.model.Schedule;
import com.wellness.management.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT', 'TEACHER')")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }

    @GetMapping("/by-filters")
    public ResponseEntity<List<Schedule>> getSchedulesByFilters(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) Long activityId) {

        List<Schedule> schedules;

        if (date != null && activityId != null) {
            schedules = scheduleService.getSchedulesByActivity(activityId);
        } else if (date != null) {
            schedules = scheduleService.getSchedulesByDate(date);
        } else {
            schedules = scheduleService.getAllSchedules();
        }

        return ResponseEntity.ok(schedules);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT', 'TEACHER')")
    public ResponseEntity<?> createSchedule(@RequestBody Schedule schedule) {
    if (schedule.getActivity() == null || schedule.getUserId() == null) {
        return ResponseEntity.badRequest().body("Activity and User ID are required.");
    }

    Schedule createdSchedule = scheduleService.createSchedule(schedule);
    return ResponseEntity.status(201).body(createdSchedule);
}

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT', 'TEACHER')")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, schedule));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT', 'TEACHER')")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
