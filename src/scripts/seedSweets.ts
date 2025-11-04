import { dbRun, dbGet, initDatabase } from '../db/database';

const sampleSweets = [
  { name: 'Laddu', category: 'Traditional', pricePerKilo: 500, quantity: 50 },
  { name: 'Gulab Jamun', category: 'Traditional', pricePerKilo: 400, quantity: 40 },
  { name: 'Jalebi', category: 'Traditional', pricePerKilo: 350, quantity: 60 },
  { name: 'Rasgulla', category: 'Traditional', pricePerKilo: 450, quantity: 45 },
  { name: 'Barfi', category: 'Mithai', pricePerKilo: 600, quantity: 35 },
  { name: 'Kaju Katli', category: 'Mithai', pricePerKilo: 1200, quantity: 25 },
  { name: 'Peda', category: 'Mithai', pricePerKilo: 800, quantity: 30 },
  { name: 'Chocolate Bar', category: 'Chocolate', pricePerKilo: 200, quantity: 100 },
  { name: 'Dark Chocolate', category: 'Chocolate', pricePerKilo: 300, quantity: 75 },
  { name: 'Candy', category: 'Candy', pricePerKilo: 150, quantity: 200 },
  { name: 'Toffee', category: 'Candy', pricePerKilo: 100, quantity: 150 },
  { name: 'Halwa', category: 'Traditional', pricePerKilo: 550, quantity: 40 },
];

async function seedSweets() {
  try {
    await initDatabase();
    console.log('Database initialized');

    // Check if sweets already exist
    const existing = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM sweets');
    
    if (existing && existing.count > 0) {
      console.log('Sweets already exist in database. Skipping seed.');
      return;
    }

    // Insert sample sweets
    for (const sweet of sampleSweets) {
      const pricePerKilo = (sweet as any).pricePerKilo || (sweet as any).price || 0;
      await dbRun(
        'INSERT INTO sweets (name, category, price, price_per_kilo, quantity) VALUES (?, ?, ?, ?, ?)',
        [sweet.name, sweet.category, pricePerKilo, pricePerKilo, sweet.quantity]
      );
      console.log(`Added: ${sweet.name} - ₹${pricePerKilo}/kg`);
    }

    console.log(`\n✅ Successfully seeded ${sampleSweets.length} sweets!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding sweets:', error);
    process.exit(1);
  }
}

seedSweets();

