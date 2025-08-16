import { seedDatabase } from './dist/scripts/seedDatabase.js';

console.log('🌱 Starting database seeding process...\n');

try {
  await seedDatabase();
  console.log('\n✅ Database seeding completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Database seeding failed:', error.message);
  process.exit(1);
}
