import db from "../db/db.js";

// Sample client data
const sampleClients = [
  {
    name: "Martin Zulu",
    sex: "male",
    nrc: "236700/17/1",
    phone: "0973751057",
    email: "martin.zulu@example.com",
    address: "Garden Chilulu, Lusaka",
    plotDetails: {
      plotSize: "20 x 20",
      plotNumber: "7",
      siteName: "F",
      grandPrice: 15000,
      amountPaid: 15000,
      balance: 0,
      allocated: "yes",
      allocationDate: "2024-09-20",
      paymentStatus: "fully paid",
      dateBought: "01-02-2020",
      dateUpdated: "15-09-2025",
    },
    witness: {
      name: "Jane Doe",
      sex: "female",
      nrc: "449952/10/7",
      email: "jane.doe@example.com",
      phone: "0973751058",
      address: "123 Main St, Anytown, USA",
      relationship: "sister",
    },
    documents: {
      nrcLink: "https://gdrive.com/file/1234567890",
      letterOfSaleLink: "https://gdrive.com/file/1232547899",
      landAgreementLink: "https://gdrive.com/file/3232547853",
      allocationFormLink: "https://gdrive.com/file/3232547855",
      authorizationLetterLink: "https://gdrive.com/file/3232547854",
    },
  },
  {
    name: "Petronella Nayame",
    sex: "female",
    nrc: "445661/18/1",
    phone: "0973751058",
    email: "petronella.nayame@example.com",
    address: "Katimamulio Road, Garden Chilulu",
    plotDetails: {
      plotSize: "40 x 30",
      plotNumber: "12",
      siteName: "G",
      grandPrice: 25000,
      amountPaid: 25000,
      balance: 0,
      allocated: "no",
      allocationDate: "2024-09-20",
      paymentStatus: "fully paid",
      dateBought: "10-09-2022",
      dateUpdated: "14-09-2024",
    },
    witness: {
      name: "Maxwell Maambo",
      sex: "male",
      nrc: "449952/10/7",
      email: "maxwell.maambo@example.com",
      phone: "0973751058",
      address: "Plot 45, Chelstone, Lusaka",
      relationship: "brother",
    },
    documents: {
      nrcLink: "https://gdrive.com/file/petronella_nrc",
      letterOfSaleLink: "https://gdrive.com/file/petronella_sale",
      landAgreementLink: "https://gdrive.com/file/petronella_agreement",
      allocationFormLink: "https://gdrive.com/file/petronella_allocation",
      authorizationLetterLink: "https://gdrive.com/file/petronella_auth",
    },
  },
  {
    name: "Paul Tiki",
    sex: "male",
    nrc: "543401/11/1",
    phone: "0977123456",
    email: "paul.tiki@example.com",
    address: "Chimwansa Olympia, Lusaka",
    plotDetails: {
      plotSize: "25 x 20",
      plotNumber: "3",
      siteName: "H",
      grandPrice: 4999,
      amountPaid: 2000,
      balance: 2999,
      allocated: "no",
      allocationDate: null,
      paymentStatus: "partial",
      dateBought: "12-09-2022",
      dateUpdated: "23-09-2024",
    },
    witness: {
      name: "William Tembo",
      sex: "male",
      nrc: "449211/10/1",
      email: "william.tembo@example.com",
      phone: "0966789123",
      address: "Plot 789, Kabulonga, Lusaka",
      relationship: "brother",
    },
    documents: {
      nrcLink: "https://gdrive.com/file/paul_nrc",
      letterOfSaleLink: "https://gdrive.com/file/paul_sale",
      landAgreementLink: "https://gdrive.com/file/paul_agreement",
      allocationFormLink: null,
      authorizationLetterLink: "https://gdrive.com/file/paul_auth",
    },
  },
  {
    name: "Grace Mukuka",
    sex: "female",
    nrc: "567890/12/1",
    phone: "0955447788",
    email: "grace.mukuka@example.com",
    address: "Roma Township, Lusaka",
    plotDetails: {
      plotSize: "30 x 25",
      plotNumber: "15",
      siteName: "A",
      grandPrice: 18000,
      amountPaid: 10000,
      balance: 8000,
      allocated: "yes",
      allocationDate: "2024-11-15",
      paymentStatus: "partial",
      dateBought: "15-01-2023",
      dateUpdated: "20-11-2024",
    },
    witness: {
      name: "Sarah Phiri",
      sex: "female",
      nrc: "123456/89/1",
      email: "sarah.phiri@example.com",
      phone: "0977998877",
      address: "Plot 234, Woodlands, Lusaka",
      relationship: "friend",
    },
    documents: {
      nrcLink: "https://gdrive.com/file/grace_nrc",
      letterOfSaleLink: "https://gdrive.com/file/grace_sale",
      landAgreementLink: "https://gdrive.com/file/grace_agreement",
      allocationFormLink: "https://gdrive.com/file/grace_allocation",
      authorizationLetterLink: "https://gdrive.com/file/grace_auth",
    },
  },
  {
    name: "Joseph Banda",
    sex: "male",
    nrc: "678901/23/1",
    phone: "0966554433",
    email: "joseph.banda@example.com",
    address: "Matero Main, Lusaka",
    plotDetails: {
      plotSize: "35 x 30",
      plotNumber: "8",
      siteName: "B",
      grandPrice: 22000,
      amountPaid: 22000,
      balance: 0,
      allocated: "yes",
      allocationDate: "2024-08-10",
      paymentStatus: "fully paid",
      dateBought: "05-06-2023",
      dateUpdated: "10-08-2024",
    },
    witness: {
      name: "Ruth Mwansa",
      sex: "female",
      nrc: "234567/90/1",
      email: "ruth.mwansa@example.com",
      phone: "0955112233",
      address: "Plot 567, Avondale, Lusaka",
      relationship: "cousin",
    },
    documents: {
      nrcLink: "https://gdrive.com/file/joseph_nrc",
      letterOfSaleLink: "https://gdrive.com/file/joseph_sale",
      landAgreementLink: "https://gdrive.com/file/joseph_agreement",
      allocationFormLink: "https://gdrive.com/file/joseph_allocation",
      authorizationLetterLink: "https://gdrive.com/file/joseph_auth",
    },
  },
];

function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    db.prepare("DELETE FROM documents").run();
    db.prepare("DELETE FROM witnesses").run();
    db.prepare("DELETE FROM plot_details").run();
    db.prepare("DELETE FROM clients").run();

    // Reset auto-increment counters (only if sqlite_sequence exists)
    try {
      db.prepare("DELETE FROM sqlite_sequence WHERE name='clients'").run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name='plot_details'").run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name='witnesses'").run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name='documents'").run();
    } catch (error) {
      // sqlite_sequence table doesn't exist yet, which is fine
      console.log(
        "Note: sqlite_sequence table not found (this is normal for empty databases)",
      );
    }

    // Prepare insert statements
    const insertClient = db.prepare(`
      INSERT INTO clients (name, sex, nrc, phone, email, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertPlotDetails = db.prepare(`
      INSERT INTO plot_details (
        client_id, plot_size, plot_number, site_name, grand_price,
        amount_paid, balance, allocated, allocation_date, payment_status,
        date_bought, date_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertWitness = db.prepare(`
      INSERT INTO witnesses (
        client_id, name, sex, nrc, email, phone, address, relationship
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDocuments = db.prepare(`
      INSERT INTO documents (
        client_id, nrc_link, letter_of_sale_link, land_agreement_link,
        allocation_form_link, authorization_letter_link
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Create transaction for atomic operations
    const insertClientTransaction = db.transaction((clientData) => {
      // Insert main client data
      const clientInfo = insertClient.run(
        clientData.name,
        clientData.sex,
        clientData.nrc,
        clientData.phone,
        clientData.email,
        clientData.address,
      );

      const clientId = clientInfo.lastInsertRowid;

      // Insert plot details
      if (clientData.plotDetails) {
        const plot = clientData.plotDetails;
        insertPlotDetails.run(
          clientId,
          plot.plotSize,
          plot.plotNumber,
          plot.siteName,
          plot.grandPrice,
          plot.amountPaid,
          plot.balance,
          plot.allocated,
          plot.allocationDate,
          plot.paymentStatus,
          plot.dateBought,
          plot.dateUpdated,
        );
      }

      // Insert witness information
      if (clientData.witness) {
        const witness = clientData.witness;
        insertWitness.run(
          clientId,
          witness.name,
          witness.sex,
          witness.nrc,
          witness.email,
          witness.phone,
          witness.address,
          witness.relationship,
        );
      }

      // Insert documents
      if (clientData.documents) {
        const docs = clientData.documents;
        insertDocuments.run(
          clientId,
          docs.nrcLink,
          docs.letterOfSaleLink,
          docs.landAgreementLink,
          docs.allocationFormLink,
          docs.authorizationLetterLink,
        );
      }

      return clientId;
    });

    // Insert all sample clients
    console.log("Inserting sample clients...");
    let insertedCount = 0;

    for (const client of sampleClients) {
      const clientId = insertClientTransaction(client);
      insertedCount++;
      console.log(`✓ Inserted client: ${client.name} (ID: ${clientId})`);
    }

    console.log(`\n🎉 Database seeding completed successfully!`);
    console.log(`📊 Total clients inserted: ${insertedCount}`);

    // Display summary statistics
    const clientCount = db
      .prepare("SELECT COUNT(*) as count FROM clients")
      .get() as { count: number };
    const plotCount = db
      .prepare("SELECT COUNT(*) as count FROM plot_details")
      .get() as { count: number };
    const witnessCount = db
      .prepare("SELECT COUNT(*) as count FROM witnesses")
      .get() as { count: number };
    const docCount = db
      .prepare("SELECT COUNT(*) as count FROM documents")
      .get() as { count: number };

    console.log("\n📈 Database Statistics:");
    console.log(`   Clients: ${clientCount.count}`);
    console.log(`   Plot Details: ${plotCount.count}`);
    console.log(`   Witnesses: ${witnessCount.count}`);
    console.log(`   Documents: ${docCount.count}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
