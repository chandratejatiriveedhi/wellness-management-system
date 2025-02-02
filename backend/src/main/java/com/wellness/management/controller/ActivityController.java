package com.wellness.management.controller;

import com.wellness.management.model.Activity;
import com.wellness.management.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ADMIN')") // You can modify roles based on your requirements
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    // Endpoint to search activities (you can add more search params if needed)
    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ADMIN')") 
    public ResponseEntity<List<Activity>> searchActivities(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean faceToFace) {
        // Modify the service method to handle search based on parameters
        return ResponseEntity.ok(activityService.searchActivity(name, type, faceToFace));
    }

    // Get all activities
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')") 
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    // Get an activity by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')") 
    public ResponseEntity<Activity> getActivity(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    // Create a new activity
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')") // Ensure that only users with the 'ADMIN' role can create activities
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        Activity createdActivity = activityService.createActivity(activity);
        return ResponseEntity.status(201).body(createdActivity); // Returning HTTP 201 Created status
    }

    // Update an existing activity
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody Activity activity) {
        Activity updatedActivity = activityService.updateActivity(id, activity);
        return ResponseEntity.ok(updatedActivity);
    }

    // Delete an activity
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok(Map.of("deleted", true)); // Returning a simple response indicating deletion
    }
}
