package com.cricket.cricketScore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for development APIs
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Permit all endpoints
                )
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); // Allow H2 console frames if needed

        return http.build();
    }
}