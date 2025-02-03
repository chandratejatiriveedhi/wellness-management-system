package com.wellness.management.service;

import com.wellness.management.model.Activity;
import com.wellness.management.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;
    
    public Activity createActivity(Activity activity) {
        return activityRepository.save(activity);
    }
    
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }
    
    public Activity getActivityById(Long id) {
        return activityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Activity not found"));
    }
    
    public Activity updateActivity(Long id, Activity activityDetails) {
        Activity activity = getActivityById(id);
        activity.setName(activityDetails.getName());
        activity.setInPerson(activityDetails.isInPerson());
        activity.setType(activityDetails.getType());
        activity.setDescription(activityDetails.getDescription());
        return activityRepository.save(activity);
    }
    
    public void deleteActivity(Long id) {
        Activity activity = getActivityById(id);
        activityRepository.delete(activity);
    }

    // ✅ Search activities based on name, type, and inPerson
    public List<Activity> searchActivity(String name, String type, Boolean inPerson) {
        if (name != null && type != null && inPerson != null) {
            return activityRepository.findByNameContainingAndTypeAndInPerson(name, type, inPerson);
        } else if (name != null && type != null) {
            return activityRepository.findByNameContainingAndType(name, type);
        } else if (name != null) {
            return activityRepository.findByNameContaining(name);
        } else if (type != null) {
            return activityRepository.findByType(type);
        } else if (inPerson != null) {
            return activityRepository.findByInPerson(inPerson);
        }
        return activityRepository.findAll();
    }
}
