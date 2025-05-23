-- Create the database
CREATE DATABASE IF NOT EXISTS jinky_eindex;
USE jinky_eindex;
-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rfid_tag VARCHAR(50) NOT NULL UNIQUE,
    course VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    section VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Add student_id column to students table
ALTER TABLE students
ADD COLUMN student_id VARCHAR(8) NULL
AFTER id;
-- Update existing records with formatted student IDs
UPDATE students
SET student_id = CONCAT('00-', LPAD(id, 4, '0'))
WHERE student_id IS NULL;
-- Now add the NOT NULL and UNIQUE constraints
ALTER TABLE students
MODIFY COLUMN student_id VARCHAR(8) NOT NULL UNIQUE;
-- Add check constraint for student_id format (00-0000)
ALTER TABLE students
ADD CONSTRAINT chk_student_id_format CHECK (student_id REGEXP '^[0-9]{2}-[0-9]{4}$');
-- Create records table
CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    category ENUM('quizzes', 'exams', 'activities') NOT NULL,
    record_number INT NOT NULL,
    items INT NOT NULL,
    score FLOAT NOT NULL,
    subject ENUM('IT223', 'IT221') NOT NULL,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY category_number (student_id, category, record_number, subject)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    teacher VARCHAR(100) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    date_time DATETIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;