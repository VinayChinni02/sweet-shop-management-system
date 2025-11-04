import { dbAll, dbGet, dbRun, initDatabase } from '../db/database';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function executeQuery(query: string): Promise<void> {
  try {
    await initDatabase();
    
    const trimmedQuery = query.trim().toUpperCase();
    
    // Check if it's a SELECT query
    if (trimmedQuery.startsWith('SELECT')) {
      const results = await dbAll(query);
      if (results.length === 0) {
        console.log('\n📊 No results found.\n');
      } else {
        console.log('\n📊 Results:');
        console.table(results);
        console.log(`\n✅ Found ${results.length} row(s)\n`);
      }
    }
    // Check if it's an INSERT, UPDATE, or DELETE query
    else if (trimmedQuery.startsWith('INSERT') || trimmedQuery.startsWith('UPDATE') || trimmedQuery.startsWith('DELETE')) {
      const result = await dbRun(query);
      console.log(`\n✅ Query executed successfully.`);
      if ('lastID' in result) {
        console.log(`   Last inserted ID: ${result.lastID}`);
      }
      if ('changes' in result) {
        console.log(`   Rows affected: ${result.changes}\n`);
      }
    }
    // For other queries (CREATE, DROP, etc.)
    else {
      await dbRun(query);
      console.log('\n✅ Query executed successfully.\n');
    }
  } catch (error: any) {
    console.error('\n❌ Error executing query:', error.message);
    console.error('   Query:', query);
    console.log('');
  }
}

function promptQuery(): void {
  rl.question('SQL> ', async (query) => {
    if (query.trim().toLowerCase() === 'exit' || query.trim().toLowerCase() === 'quit') {
      console.log('\n👋 Goodbye!\n');
      rl.close();
      process.exit(0);
    }
    
    if (query.trim().toLowerCase() === 'help') {
      console.log(`
📖 Available Commands:
  - Type any SQL query and press Enter
  - 'help' - Show this help message
  - 'exit' or 'quit' - Exit the query executor

📋 Example Queries:
  SELECT * FROM users;
  SELECT * FROM purchases WHERE user_id = 1;
  SELECT u.name, u.email, s.name as sweet_name, p.quantity, p.total_price 
  FROM purchases p 
  JOIN users u ON p.user_id = u.id 
  JOIN sweets s ON p.sweet_id = s.id;
  
💡 Tips:
  - Use SELECT to view data
  - Use INSERT/UPDATE/DELETE to modify data
  - Be careful with DELETE queries!
`);
      promptQuery();
      return;
    }
    
    if (query.trim() === '') {
      promptQuery();
      return;
    }
    
    await executeQuery(query);
    promptQuery();
  });
}

console.log(`
╔══════════════════════════════════════════════════════════╗
║     Sweet Shop Database Query Executor                   ║
╚══════════════════════════════════════════════════════════╝

Type 'help' for commands or 'exit' to quit.
Ready to execute SQL queries...

`);

promptQuery();

