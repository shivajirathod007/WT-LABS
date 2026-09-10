package com.wtlabs.as6.bookstore.service;

import java.util.List;
import com.wtlabs.as6.bookstore.model.Book;
import com.wtlabs.as6.bookstore.repository.BookRepository;
import org.springframework.stereotype.Service;

@Service
public class BookService {

  private final BookRepository bookRepository;

  public BookService(BookRepository bookRepository) {
    this.bookRepository = bookRepository;
  }

  public List<Book> getAllBooks() {
    return bookRepository.findAll();
  }
}
