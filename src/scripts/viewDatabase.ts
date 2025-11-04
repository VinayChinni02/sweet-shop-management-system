import { dbGet, dbAll, initDatabase } from '../db/database';

async function viewDatabase() {
  try {
    await initDatabase();
    console.log('\n📊 DATABASE CONTENTS\n');
    console.log('='.repeat(80));
    
    // View Users
    console.log('\n👥 USERS TABLE:');
    console.log('-'.repeat(80));
    const users = await dbAll('SELECT id, email, name, phone, role, created_at FROM users');
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      const formattedUsers = users.map((user: any) => ({
        ID: user.id,
        Email: user.email,
        Name: user.name || 'N/A',
        Phone: user.phone || 'N/A',
        Role: user.role,
        Created: new Date(user.created_at).toLocaleDateString(),
      }));
      console.table(formattedUsers);
    }
    
    // View Sweets
    console.log('\n🍬 SWEETS TABLE:');
    console.log('-'.repeat(80));
    const sweets = await dbAll('SELECT id, name, category, price, price_per_kilo, quantity, created_at FROM sweets');
    if (sweets.length === 0) {
      console.log('No sweets found.');
    } else {
      // Format for better display
      const formattedSweets = sweets.map((sweet: any) => ({
        ID: sweet.id,
        Name: sweet.name,
        Category: sweet.category,
        Price: sweet.price ? `₹${sweet.price.toFixed(2)}` : 'N/A',
        'Price/Kg': sweet.price_per_kilo ? `₹${sweet.price_per_kilo.toFixed(2)}` : 'N/A',
        Stock: `${sweet.quantity.toFixed(2)} kg`,
        Created: new Date(sweet.created_at).toLocaleDateString(),
      }));
      console.table(formattedSweets);
    }
    
    // View Purchases
    console.log('\n🛒 PURCHASES TABLE (Purchase History):');
    console.log('-'.repeat(80));
    const purchases = await dbAll(`
      SELECT 
        p.id,
        u.email as user_email,
        u.name as user_name,
        u.phone as user_phone,
        s.name as sweet_name,
        p.quantity,
        p.price_per_kg,
        p.total_price,
        p.created_at
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      JOIN sweets s ON p.sweet_id = s.id
      ORDER BY p.created_at DESC
    `);
    
    if (purchases.length === 0) {
      console.log('No purchases found.');
    } else {
      const formattedPurchases = purchases.map((p: any) => ({
        ID: p.id,
        'User Email': p.user_email,
        'User Name': p.user_name || 'N/A',
        'User Phone': p.user_phone || 'N/A',
        'Sweet': p.sweet_name,
        'Quantity': `${p.quantity} kg`,
        'Price/Kg': `₹${p.price_per_kg.toFixed(2)}`,
        'Total': `₹${p.total_price.toFixed(2)}`,
        'Date': new Date(p.created_at).toLocaleString(),
      }));
      console.table(formattedPurchases);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Database view complete!');
    console.log('\n💡 Tip: Use "npm run query-db" to execute custom SQL queries.\n');
    
  } catch (error) {
    console.error('❌ Error viewing database:', error);
  } finally {
    process.exit(0);
  }
}

viewDatabase();

