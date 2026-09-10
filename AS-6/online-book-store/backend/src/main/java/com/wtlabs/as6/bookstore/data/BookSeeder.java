package com.wtlabs.as6.bookstore.data;

import java.util.List;
import com.wtlabs.as6.bookstore.model.Book;
import com.wtlabs.as6.bookstore.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class BookSeeder implements CommandLineRunner {

  private final BookRepository bookRepository;

  public BookSeeder(BookRepository bookRepository) {
    this.bookRepository = bookRepository;
  }

  @Override
  public void run(String... args) {
    if (bookRepository.count() > 0) {
      return;
    }

    bookRepository.saveAll(List.of(
        new Book(
            "Learning React",
            "Alex Banks",
            "Programming",
            "A practical guide to modern React concepts and component design.",
            499,
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
            true),
        new Book(
            "Spring Boot in Action",
            "Craig Walls",
            "Backend",
            "Build production-ready applications with the Spring Boot ecosystem.",
            599,
            "https://images.unsplash.com/photo-1455885666463-0d4b10be1b34?auto=format&fit=crop&w=900&q=80",
            true),
        new Book(
            "Database Essentials",
            "R. Malik",
            "Database",
            "Understand data modeling, queries, and collection-based storage patterns.",
            399,
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
            false),
        new Book(
            "Java Fundamentals",
            "P. Kumar",
            "Programming",
            "A compact guide to object-oriented programming and Java syntax.",
            349,
            "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
            false),
        new Book(
            "MongoDB Essentials",
            "S. Verma",
            "Database",
            "An introduction to document databases and schema design.",
            429,
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
            false)));
  }
}
