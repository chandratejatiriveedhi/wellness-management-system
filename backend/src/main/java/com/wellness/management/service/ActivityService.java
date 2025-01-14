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
        activity.setFaceToFace(activityDetails.isFaceToFace());
        activity.setType(activityDetails.getType());
        activity.setDescription(activityDetails.getDescription());
        return activityRepository.save(activity);
    }
    
    public void deleteActivity(Long id) {
        Activity activity = getActivityById(id);
        activityRepository.delete(activity);
    }
}