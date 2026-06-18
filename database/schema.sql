
-- Create database
CREATE DATABASE IF NOT EXISTS `ess_promotion_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `ess_promotion_db`;

-- ─── Table: admins ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
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

-- ─── Table: promotions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promotions (
  id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(255)    NOT NULL,
  department      VARCHAR(100)    NOT NULL,
  description     LONGTEXT        NOT NULL,
  requirements    TEXT            DEFAULT NULL,
  attachment_path VARCHAR(500)    DEFAULT NULL COMMENT 'Relative path to uploaded PDF/DOC',
  publish_date    DATE            NOT NULL,
  deadline        DATE            DEFAULT NULL,
  status          ENUM('active','expired','draft')
                  NOT NULL DEFAULT 'active',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_promotions_status     (status),
  INDEX idx_promotions_department (department),
  INDEX idx_promotions_deadline   (deadline),
  INDEX idx_promotions_publish    (publish_date),
  FULLTEXT INDEX ft_promotions_search (title, description)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Internal promotion listings';

-- ─── Table: news ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)    NOT NULL,
  content     LONGTEXT        NOT NULL,
  image_path  VARCHAR(500)    DEFAULT NULL COMMENT 'Relative path to uploaded image',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_news_created (created_at),
  FULLTEXT INDEX ft_news_search (title, content)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Organizational news and announcements';