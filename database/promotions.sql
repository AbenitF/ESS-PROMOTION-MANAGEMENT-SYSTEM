CREATE TABLE IF NOT EXISTS promotions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admins_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description LONGTEXT NOT NULL,
    requirements TEXT DEFAULT NULL,
    attachment_path VARCHAR(500) DEFAULT NULL COMMENT 'Relative path to uploaded PDF/DOC',
    publish_date DATE NOT NULL,
    deadline DATE DEFAULT NULL,
    status ENUM('active','expired','draft')
        NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_promotions_status (status),
    INDEX idx_promotions_department (department),
    INDEX idx_promotions_deadline (deadline),
    INDEX idx_promotions_publish (publish_date),
    FULLTEXT INDEX ft_promotions_search (title, description)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
COMMENT='Internal promotion listings';