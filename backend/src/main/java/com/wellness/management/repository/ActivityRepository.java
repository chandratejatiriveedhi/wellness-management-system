package com.wellness.management.repository;

import com.wellness.management.model.Activity;
//import com.wellness.management.model.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByNameContaining(String name);
    List<Activity> findByType(String type);  // Ensure type is stored as String or change accordingly
    List<Activity> findByInPerson(Boolean inPerson);
    List<Activity> findByNameContainingAndType(String name, String type);
    List<Activity> findByNameContainingAndTypeAndInPerson(String name, String type, Boolean inPerson);
}
