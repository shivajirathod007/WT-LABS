package com.vit.semesterresult.repository;

import com.vit.semesterresult.model.StudentResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentResultRepository extends MongoRepository<StudentResult, String> {
    // Additional query methods can be defined here if needed
}
