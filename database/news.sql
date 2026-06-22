CREATE TABLE IF NOT EXISTS news (
  id          INT UNSIGNED    PRIMARY KEY, -- No AUTO_INCREMENT (Manual ID generation)
  title       VARCHAR(255)    NOT NULL,
  content     LONGTEXT        NOT NULL,
  image_path  VARCHAR(500)    DEFAULT NULL COMMENT 'Relative path to uploaded image',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  
  -- Automatically calculates exactly 7 days from the creation timestamp
  expires_at  DATETIME        GENERATED ALWAYS AS (created_at + INTERVAL 7 DAY) STORED,

  INDEX idx_news_created (created_at),
  INDEX idx_news_expiry  (expires_at), -- Index added for fast employee feed filtering
  FULLTEXT INDEX ft_news_search (title, content)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Organizational news and announcements with automatic 7-day expiration';