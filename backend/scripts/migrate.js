/**
 * Database Migration Script
 * Creates all tables for the ESS Promotion Management System.
 * Run with: npm run migrate
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'ess_promotion_db';

const run = async () => {
  // Step 1: Connect WITHOUT selecting a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  console.log('✅ Connected to MySQL server.');

  // Step 2: Create database using query() — DDL not supported by prepared statements
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`✅ Database "${DB_NAME}" ready.`);

  // Step 3: Close and reconnect with the database selected
  await connection.end();

  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: DB_NAME,
  });

  // ─── admins table ──────────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      full_name     VARCHAR(100)  NOT NULL,
      username      VARCHAR(50)   NOT NULL UNIQUE,
      email         VARCHAR(150)  NOT NULL UNIQUE,
      password_hash VARCHAR(255)  NOT NULL,
      role          ENUM('ADMIN','SUPER_ADMIN','HR_MANAGER','CONTENT_MANAGER')
                    NOT NULL DEFAULT 'ADMIN',
      created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_admins_username (username),
      INDEX idx_admins_email    (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Table "admins" ready.');

  // ─── promotions table ──────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS promotions (
      id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title           VARCHAR(255)  NOT NULL,
      department      VARCHAR(100)  NOT NULL,
      description     LONGTEXT      NOT NULL,
      requirements    TEXT          DEFAULT NULL,
      attachment_path VARCHAR(500)  DEFAULT NULL,
      publish_date    DATE          NOT NULL,
      deadline        DATE          DEFAULT NULL,
      status          ENUM('active','expired','draft') NOT NULL DEFAULT 'active',
      created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_promotions_status     (status),
      INDEX idx_promotions_department (department),
      INDEX idx_promotions_deadline   (deadline)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Table "promotions" ready.');

  // ─── news table ────────────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS news (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title       VARCHAR(255) NOT NULL,
      content     LONGTEXT     NOT NULL,
      image_path  VARCHAR(500) DEFAULT NULL,
      created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_news_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Table "news" ready.');

  await db.end();
  console.log('\n🎉 Migration completed successfully.\n');
};

run().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
