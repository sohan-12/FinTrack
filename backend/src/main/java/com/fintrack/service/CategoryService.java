package com.fintrack.service;

import com.fintrack.exception.BadRequestException;
import com.fintrack.model.Category;
import com.fintrack.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Category Service for retrieving and managing transaction categories.
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new BadRequestException("Category name cannot be empty.");
        }
        String cleanName = name.trim();
        return categoryRepository.findByName(cleanName)
                .orElseGet(() -> categoryRepository.save(new Category(cleanName)));
    }
}
