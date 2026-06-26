/**
 * Database Seed Script
 * Creates default admin account and sample data.
 * Run with: npm run seed
 * Default credentials: admin / Admin@1234
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const run = async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ess_promotion_db',
  });

  console.log('✅ Connected to database.');

  // ─── Seed Admin ────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@1234', 12);

  const [existing] = await db.query(
    'SELECT id FROM admins WHERE username = ?',
    ['admin']
  );

  if (existing.length === 0) {
    await db.query(
      `INSERT INTO admins (full_name, username, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      ['System Administrator', 'admin', 'admin@ess.gov.et', passwordHash, 'ADMIN']
    );
    console.log('✅ Default admin created:');
    console.log('   Username : admin');
    console.log('   Password : Admin@1234');
    console.log('   ⚠️  Change this password after first login!');
  } else {
    console.log('ℹ️  Admin already exists. Skipping.');
  }

  // ─── Seed Sample Promotions ────────────────────────────────────────────────
  const [existingPromos] = await db.query('SELECT COUNT(*) as count FROM promotions');
  if (existingPromos[0].count === 0) {
    await db.query(`
      INSERT INTO promotions (title, department, description, requirements, publish_date, deadline, status)
      VALUES
      (
        'Senior Statistician - Grade VII',
        'Statistics Department',
        'The Ethiopian Statistical Service invites qualified employees to apply for the position of Senior Statistician. This role involves leading complex statistical analysis projects, mentoring junior statisticians, and producing high-quality national statistics reports.',
        'BSc/MSc in Statistics or related field. Minimum 5 years experience. Strong analytical skills. Proficiency in statistical software (SPSS, R, Stata).',
        CURDATE(),
        DATE_ADD(CURDATE(), INTERVAL 30 DAY),
        'active'
      ),
      (
        'IT Systems Administrator',
        'Information Technology Department',
        'We are seeking an experienced IT Systems Administrator to manage our internal server infrastructure, ensure system uptime, and support staff with technical issues across all ESS offices.',
        'BSc in Computer Science or IT. Minimum 3 years experience in system administration. Knowledge of Linux/Windows Server, networking, and cybersecurity basics.',
        CURDATE(),
        DATE_ADD(CURDATE(), INTERVAL 21 DAY),
        'active'
      ),
      (
        'Human Resources Officer',
        'Human Resources Department',
        'An exciting opportunity for an HR professional to join the ESS HR team. The successful candidate will handle recruitment, employee relations, performance management, and HR policy implementation.',
        'BA/MA in Human Resources, Management, or related field. Minimum 4 years HR experience. Strong interpersonal and communication skills.',
        CURDATE(),
        DATE_ADD(CURDATE(), INTERVAL 10 DAY),
        'active'
      )
    `);
    console.log('✅ Sample promotions seeded.');
  } else {
    console.log('ℹ️  Promotions already exist. Skipping.');
  }

  // ─── Seed Sample News ──────────────────────────────────────────────────────
  const [existingNews] = await db.query('SELECT COUNT(*) as count FROM news');
  if (existingNews[0].count === 0) {
    await db.query(`
      INSERT INTO news (title, content) VALUES
      (
        'ESS Launches 2024 National Census Planning Initiative',
        'The Ethiopian Statistical Service has officially launched its comprehensive planning initiative for the upcoming National Census. This landmark project will involve data collection from all regions of Ethiopia and is expected to provide critical demographic data to guide national development planning.\n\nThe planning phase includes staff recruitment, training programs, and technology infrastructure upgrades to support efficient data collection and processing.'
      ),
      (
        'New Statistical Capacity Building Workshop Completed',
        'ESS successfully concluded a five-day Statistical Capacity Building Workshop for 120 employees across regional offices. The workshop covered modern data collection methods, statistical software tools, and best practices in data quality assurance.\n\nParticipants received certificates of completion and will serve as regional trainers to cascade the knowledge to field staff.'
      ),
      (
        'ESS Partners with International Statistical Organizations',
        'The Ethiopian Statistical Service has signed memoranda of understanding with the African Development Bank and the United Nations Statistical Commission to strengthen statistical capacity in Ethiopia.\n\nThis partnership will facilitate technical assistance, knowledge transfer, and access to advanced statistical methodologies that align with international standards.'
      ),
      (
        'Annual Staff Performance Review Process Now Open',
        'The annual performance review process for all ESS employees has commenced. Staff members are requested to complete their self-assessment forms through the HR management system by the end of this month.\n\nLine managers will conduct review meetings in the following two weeks. Results will be used for promotion considerations, training needs assessment, and compensation reviews.'
      )
    `);
    console.log('✅ Sample news seeded.');
  } else {
    console.log('ℹ️  News already exist. Skipping.');
  }

  await db.end();
  console.log('\n🎉 Seeding completed successfully.\n');
};

run().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
