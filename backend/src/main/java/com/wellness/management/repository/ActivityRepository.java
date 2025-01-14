package com.wellness.management.repository;

import com.wellness.management.model.Activity;
import com.wellness.management.model.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByType(ActivityType type);
    List<Activity> findByFaceToFace(boolean faceToFace);
}