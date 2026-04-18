-- Drop database if it exists
CREATE DATABASE IF NOT EXISTS growth_discipline;
USE growth_discipline;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('Growth', 'Discipline', 'Health', 'Learning', 'Work', 'Other') DEFAULT 'Other',
    status ENUM('Logged', 'Completed', 'Dropped') DEFAULT 'Logged',
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI Responses table
CREATE TABLE IF NOT EXISTS ai_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT,
    response_text TEXT NOT NULL,
    sentiment VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

-- Insert a test user (password: password123)
-- In a real app, passwords would be hashed.
INSERT IGNORE INTO users (username, password) VALUES ('student', '$2b$10$EPfLirByBD7Ssh6YI.AtYe4Q4L.Wv9A.3S/p.U7s.R2Y.s6G.Vv1W');
