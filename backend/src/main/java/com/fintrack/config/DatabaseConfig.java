package com.fintrack.config;

import com.fintrack.model.Category;
import com.fintrack.model.Role;
import com.fintrack.model.Transaction;
import com.fintrack.model.TransactionType;
import com.fintrack.model.User;
import com.fintrack.repository.CategoryRepository;
import com.fintrack.repository.TransactionRepository;
import com.fintrack.repository.UserRepository;
import com.fintrack.security.PasswordEncoderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Database & Startup Configuration.
 * Automatically seeds demo categories, admin/user accounts, and realistic transaction data
 * upon first startup if tables are empty.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository,
                                          CategoryRepository categoryRepository,
                                          TransactionRepository transactionRepository,
                                          PasswordEncoderUtil passwordEncoder) {
        return args -> {
            logger.info("Checking and seeding initial database records...");

            // 1. Seed Categories if empty
            if (categoryRepository.count() == 0) {
                List<String> defaultCategories = Arrays.asList(
                        "Salary", "Freelance", "Investment", "Food", "Dining Out",
                        "Travel", "Rent & Housing", "Utilities & Bills", "Shopping",
                        "Entertainment", "Education", "Healthcare", "Groceries", "Other"
                );
                for (String cat : defaultCategories) {
                    categoryRepository.save(new Category(cat));
                }
                logger.info("Seeded {} default categories.", defaultCategories.size());
            }

            // 2. Seed Admin and Users if empty
            if (userRepository.count() == 0) {
                User admin = new User(
                        "System Admin",
                        "admin@fintrack.com",
                        passwordEncoder.encode("Admin@123"),
                        Role.ADMIN
                );
                userRepository.save(admin);

                User john = new User(
                        "John Doe",
                        "john@example.com",
                        passwordEncoder.encode("User@123"),
                        Role.USER
                );
                userRepository.save(john);

                User jane = new User(
                        "Jane Smith",
                        "jane@example.com",
                        passwordEncoder.encode("User@123"),
                        Role.USER
                );
                userRepository.save(jane);

                logger.info("Seeded Admin (admin@fintrack.com) and Users (john@example.com, jane@example.com)");

                // 3. Seed 35+ realistic transactions for John Doe
                LocalDate today = LocalDate.now();
                Long johnId = john.getId();

                List<Transaction> demoTxList = Arrays.asList(
                        // Income
                        new Transaction(johnId, TransactionType.INCOME, new BigDecimal("4500.00"), "Salary", "Monthly Tech Salary", today.minusDays(3)),
                        new Transaction(johnId, TransactionType.INCOME, new BigDecimal("850.00"), "Freelance", "React Web Development Project", today.minusDays(10)),
                        new Transaction(johnId, TransactionType.INCOME, new BigDecimal("120.00"), "Investment", "Stock Dividend Payout", today.minusDays(18)),
                        new Transaction(johnId, TransactionType.INCOME, new BigDecimal("4500.00"), "Salary", "Previous Month Tech Salary", today.minusDays(33)),
                        new Transaction(johnId, TransactionType.INCOME, new BigDecimal("600.00"), "Freelance", "UI/UX Consultation", today.minusDays(40)),
                        new Transaction(johnId, TransactionType.INCOME, new BigDecimal("4500.00"), "Salary", "Tech Salary", today.minusDays(63)),

                        // Housing & Utilities
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("1200.00"), "Rent & Housing", "Apartment Monthly Rent", today.minusDays(2)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("95.00"), "Utilities & Bills", "Electricity & Water Bill", today.minusDays(4)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("60.00"), "Utilities & Bills", "High-Speed Fiber Internet", today.minusDays(7)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("45.00"), "Utilities & Bills", "Mobile Phone Plan", today.minusDays(12)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("1200.00"), "Rent & Housing", "Previous Month Rent", today.minusDays(32)),

                        // Food & Dining & Groceries
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("145.50"), "Groceries", "Weekly Supermarket Haul", today.minusDays(1)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("42.00"), "Dining Out", "Dinner with Friends at Italian Bistro", today.minusDays(3)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("18.50"), "Food", "Coffee & Croissant Bakery", today.minusDays(5)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("110.20"), "Groceries", "Organic Produce & Pantry items", today.minusDays(8)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("55.00"), "Dining Out", "Weekend Sushi Dinner", today.minusDays(11)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("130.00"), "Groceries", "Monthly Wholesale Groceries", today.minusDays(16)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("28.00"), "Dining Out", "Quick Lunch Taco Bar", today.minusDays(19)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("98.00"), "Groceries", "Weekly Groceries & Snacks", today.minusDays(24)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("35.00"), "Dining Out", "Pizza Night Delivery", today.minusDays(28)),

                        // Travel & Transportation
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("50.00"), "Travel", "Monthly Transit Card Recharge", today.minusDays(6)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("32.50"), "Travel", "Uber Ride to Airport", today.minusDays(14)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("65.00"), "Travel", "Gas Station Refuel", today.minusDays(21)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("180.00"), "Travel", "Weekend Train Trip Tickets", today.minusDays(45)),

                        // Shopping & Tech
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("129.99"), "Shopping", "Ergonomic Mechanical Keyboard", today.minusDays(9)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("75.00"), "Shopping", "Casual Autumn Apparel", today.minusDays(17)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("49.99"), "Shopping", "Desk Lamp & Organizer", today.minusDays(26)),

                        // Entertainment & Subscriptions
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("19.99"), "Entertainment", "Netflix Premium Subscription", today.minusDays(5)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("10.99"), "Entertainment", "Spotify Family Plan", today.minusDays(13)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("35.00"), "Entertainment", "Cinema IMAX Tickets", today.minusDays(22)),

                        // Education & Self-Improvement
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("25.00"), "Education", "Java & Cloud Architecture Book", today.minusDays(15)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("19.99"), "Education", "Online Programming Course", today.minusDays(38)),

                        // Healthcare & Fitness
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("60.00"), "Healthcare", "Monthly Gym Membership", today.minusDays(10)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("35.00"), "Healthcare", "Pharmacy & Vitamins", today.minusDays(25)),
                        new Transaction(johnId, TransactionType.EXPENSE, new BigDecimal("45.00"), "Other", "Home Maintenance & Repairs", today.minusDays(30))
                );

                for (Transaction tx : demoTxList) {
                    transactionRepository.save(tx);
                }

                logger.info("Seeded {} demo transactions for John Doe.", demoTxList.size());
            }
        };
    }
}
