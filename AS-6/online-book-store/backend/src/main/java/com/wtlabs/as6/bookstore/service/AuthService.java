package com.wtlabs.as6.bookstore.service;

import java.time.LocalDateTime;
import com.wtlabs.as6.bookstore.dto.AuthResponse;
import com.wtlabs.as6.bookstore.dto.LoginRequest;
import com.wtlabs.as6.bookstore.dto.RegisterRequest;
import com.wtlabs.as6.bookstore.model.User;
import com.wtlabs.as6.bookstore.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private final UserRepository userRepository;

  public AuthService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public AuthResponse register(RegisterRequest request) {
    userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    });

    User user = new User(
        request.getName(),
        request.getEmail(),
        request.getPassword(),
        request.getPhone(),
        request.getAddress(),
        LocalDateTime.now());

    User savedUser = userRepository.save(user);
    return new AuthResponse("Registration successful", savedUser.getId(), savedUser.getName(), savedUser.getEmail());
  }

  public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    if (!user.getPassword().equals(request.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    return new AuthResponse("Login successful", user.getId(), user.getName(), user.getEmail());
  }
}
