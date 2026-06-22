CREATE DATABASE IF NOT EXISTS ess_promotion_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ess_promotion_db;

-- ─── Table: admins ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED    PRIMARY KEY, -- No AUTO_INCREMENT (Manual ID generation)
  full_name     VARCHAR(100)    NOT NULL,
  username      VARCHAR(50)     NOT NULL UNIQUE,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL COMMENT 'bcrypt hash, never plain text',
  role          ENUM('ADMIN','SUPER_ADMIN','HR_MANAGER','CONTENT_MANAGER')
                NOT NULL DEFAULT 'ADMIN',
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_admins_username (username),
  INDEX idx_admins_email    (email),
  INDEX idx_admins_role     (role)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='System administrators and their roles';
