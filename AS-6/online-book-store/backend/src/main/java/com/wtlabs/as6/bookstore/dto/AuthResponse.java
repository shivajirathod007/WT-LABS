package com.wtlabs.as6.bookstore.dto;

public class AuthResponse {

  private String message;
  private String userId;
  private String name;
  private String email;

  public AuthResponse(String message, String userId, String name, String email) {
    this.message = message;
    this.userId = userId;
    this.name = name;
    this.email = email;
  }

  public String getMessage() {
    return message;
  }

  public String getUserId() {
    return userId;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }
}
