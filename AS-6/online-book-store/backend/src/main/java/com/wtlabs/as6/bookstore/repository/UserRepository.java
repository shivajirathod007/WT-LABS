package com.wtlabs.as6.bookstore.repository;

import java.util.Optional;
import com.wtlabs.as6.bookstore.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

  Optional<User> findByEmail(String email);
}
