import bcrypt from 'bcryptjs';
import { dbGet, dbRun, initDatabase } from '../db/database';

async function createAdmin() {
  try {
    await initDatabase();
    console.log('Database initialized');

    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';

    // Check if admin already exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser) {
      // Update existing user to admin
      const hashedPassword = await bcrypt.hash(password, 10);
      await dbRun(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', email]
      );
      console.log(`✅ Updated user "${email}" to admin role`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      await dbRun(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, 'admin']
      );
      console.log(`✅ Created admin user: ${email}`);
    }

    console.log(`\n📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('\nYou can now login with these credentials to access admin features.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

