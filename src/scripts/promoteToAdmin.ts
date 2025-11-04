import { dbGet, dbRun, initDatabase } from '../db/database';

async function promoteToAdmin() {
  try {
    await initDatabase();
    console.log('✅ Database initialized\n');

    const email = process.argv[2];
    
    if (!email) {
      console.error('❌ Error: Please provide an email address');
      console.log('\nUsage: npm run promote-admin <email>');
      console.log('Example: npm run promote-admin user@gmail.com\n');
      process.exit(1);
    }

    // Check if user exists
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found`);
      console.log('\n💡 Tip: Make sure the user has registered first via the frontend.\n');
      process.exit(1);
    }

    // Update user to admin
    await dbRun(
      'UPDATE users SET role = ? WHERE email = ?',
      ['admin', email]
    );

    console.log(`✅ Successfully promoted "${email}" to admin role!`);
    console.log('\n📧 Admin Email:', email);
    console.log('🔑 The user can now login with their existing password to access admin features.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error promoting user to admin:', error);
    process.exit(1);
  }
}

promoteToAdmin();

