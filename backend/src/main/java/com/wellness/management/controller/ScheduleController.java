package com.wellness.management.controller;

import com.wellness.management.model.Schedule;
import com.wellness.management.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TEACHER')")
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleService.createSchedule(schedule));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Schedule>> getTeacherSchedules(@PathVariable Long teacherId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByTeacher(null));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Schedule>> getStudentSchedules(@PathVariable Long studentId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByStudent(null));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Schedule>> getSchedulesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(scheduleService.getSchedulesByDateRange(start, end));
    }

    @PutMapping("/{id}/attendance")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TEACHER')")
    public ResponseEntity<Schedule> updateAttendance(
            @PathVariable Long id,
            @RequestParam boolean attended) {
        return ResponseEntity.ok(scheduleService.updateAttendance(id, attended));
    }
}