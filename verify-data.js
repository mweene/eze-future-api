import db from './dist/db/db.js';

console.log('🔍 Verifying database data...\n');

try {
  // Get all clients with their complete data
  const getAllClientsQuery = db.prepare(`
    SELECT * FROM clients ORDER BY id
  `);

  const getPlotDetailsByClientId = db.prepare(`
    SELECT * FROM plot_details WHERE client_id = ?
  `);

  const getWitnessByClientId = db.prepare(`
    SELECT * FROM witnesses WHERE client_id = ?
  `);

  const getDocumentsByClientId = db.prepare(`
    SELECT * FROM documents WHERE client_id = ?
  `);

  const clients = getAllClientsQuery.all();

  console.log(`📊 Found ${clients.length} clients in the database:\n`);

  clients.forEach((client, index) => {
    console.log(`${index + 1}. 👤 ${client.name}`);
    console.log(`   📧 Email: ${client.email}`);
    console.log(`   📱 Phone: ${client.phone || 'N/A'}`);
    console.log(`   🆔 NRC: ${client.nrc || 'N/A'}`);
    console.log(`   🏠 Address: ${client.address || 'N/A'}`);

    // Get plot details
    const plotDetails = getPlotDetailsByClientId.get(client.id);
    if (plotDetails) {
      console.log(`   🏞️  Plot: ${plotDetails.plot_size} (Plot #${plotDetails.plot_number}, Site ${plotDetails.site_name})`);
      console.log(`   💰 Price: K${plotDetails.grand_price}, Paid: K${plotDetails.amount_paid}, Balance: K${plotDetails.balance}`);
      console.log(`   📅 Status: ${plotDetails.payment_status} - ${plotDetails.allocated === 'yes' ? 'Allocated' : 'Not Allocated'}`);
    }

    // Get witness
    const witness = getWitnessByClientId.get(client.id);
    if (witness) {
      console.log(`   👥 Witness: ${witness.name} (${witness.relationship})`);
    }

    // Get documents
    const documents = getDocumentsByClientId.get(client.id);
    if (documents) {
      const docCount = Object.values(documents).filter(doc => doc !== null && doc !== client.id && doc !== documents.id).length;
      console.log(`   📄 Documents: ${docCount} files linked`);
    }

    console.log(''); // Empty line between clients
  });

  // Summary statistics
  const stats = {
    totalClients: clients.length,
    fullyPaid: db.prepare("SELECT COUNT(*) as count FROM plot_details WHERE payment_status = 'fully paid'").get().count,
    allocated: db.prepare("SELECT COUNT(*) as count FROM plot_details WHERE allocated = 'yes'").get().count,
    totalValue: db.prepare("SELECT SUM(grand_price) as total FROM plot_details").get().total,
    totalPaid: db.prepare("SELECT SUM(amount_paid) as total FROM plot_details").get().total,
  };

  console.log('📈 Summary Statistics:');
  console.log(`   Total Clients: ${stats.totalClients}`);
  console.log(`   Fully Paid: ${stats.fullyPaid}`);
  console.log(`   Allocated Plots: ${stats.allocated}`);
  console.log(`   Total Plot Value: K${stats.totalValue}`);
  console.log(`   Total Amount Paid: K${stats.totalPaid}`);
  console.log(`   Outstanding Balance: K${stats.totalValue - stats.totalPaid}`);

} catch (error) {
  console.error('❌ Error verifying data:', error.message);
}
