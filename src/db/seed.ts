import db from "./index.js";

// Zambian names (both male and female)
const zambianNames = [
  "Chanda Mwansa", "Bwalya Katongo", "Mutale Chipango", "Kasonde Mulenga", "Natasha Banda",
  "Emmanuel Phiri", "Grace Tembo", "Joseph Kunda", "Mary Sichone", "Patrick Zulu",
  "Elizabeth Nyirenda", "Moses Kabwe", "Ruth Chilufya", "Daniel Mubanga", "Sarah Nkole",
  "Peter Mwila", "Joyce Sakala", "Christopher Simbeya", "Agnes Mwape", "Francis Kaponda",
  "Margaret Lungu", "John Kabamba", "Mercy Chisanga", "David Mbewe", "Catherine Mwanza",
  "Anthony Silwamba", "Beatrice Chanda", "Michael Ng'andu", "Prisca Sinyangwe", "Robert Kampamba",
  "Charity Mumba", "Stephen Kalaba", "Faith Kasanga", "George Siame", "Helen Bwalya",
  "Isaac Musonda", "Janet Mwila", "Kenneth Lubasi", "Lydia Chongo", "Martin Chileshe",
  "Nancy Kaseba", "Oliver Kayumba", "Patricia Mukuka", "Quinton Muyunda", "Rebecca Chisenga",
  "Samuel Nsofwa", "Theresa Mundia", "Urias Chibomba", "Veronica Kapila", "William Kangombe",
  "Alice Mwelwa", "Benjamin Chilongo", "Constance Nkhuwa", "Duncan Musenga", "Esther Mwenechanya",
  "Felix Hampongo", "Gladys Mubiana", "Henry Mazoka", "Ireen Kasonde", "Jackson Nkole",
  "Karen Chepukuma", "Lawrence Mutale", "Monica Simwanza", "Nathan Chintu", "Olivia Chanda",
  "Philip Tembo", "Queen Malama", "Richard Muleya", "Stella Mwambazi", "Timothy Kabaso",
  "Ursula Kaoma", "Victor Chanda", "Winnie Mwanawasa", "Xavier Mumba", "Yvonne Kalaba",
  "Zachary Lubinda", "Agatha Mukonda", "Brian Mwanza", "Carol Sichinga", "Dennis Mayeya",
  "Edith Chinyama", "Franklin Katebe", "Gloria Mutinta", "Harrison Kabwe", "Irene Lubambo",
  "James Simunji", "Kunda Mwanangombe", "Lovemore Mwila", "Memory Chilombo", "Nicholas Mwenda",
  "Owen Tembo", "Pauline Mulenga", "Quickson Banda", "Rose Chabala", "Silas Kapembwa",
  "Tamara Mweene", "Umberto Kasempa", "Violet Mwaba", "Washington Mutale", "Xenia Chibesakunda",
  "Yamikani Chulu", "Zipporah Chola", "Anderson Maimbo", "Bridget Sialubalo", "Collins Mwangi",
  "Dorothy Zulu", "Edwin Mubanga", "Florence Banda", "Gibson Siamachoka", "Hannah Phiri",
  "Ivan Muyeba", "Josephine Chiluba", "Kevin Sakala", "Linda Chileshe", "Maxwell Chanda",
  "Ndanji Mutale", "Oscar Nyirenda", "Prudence Mwanza", "Quincy Kabwe", "Rosemary Mulenga",
  "Simon Chilufya", "Twambo Banda", "Umoya Tembo", "Victoria Katongo", "Walter Mwila"
];

// Zambian locations/areas
const zambianLocations = [
  "Garden Compound", "Kanyama", "Matero", "Chilenje", "Roma", "Northmead", "Woodlands",
  "Avondale", "Olympia", "Kalundu", "Kamwala", "New Kasama", "Libala", "Chelstone",
  "PHI", "Mtendere", "Ng'ombe", "George", "Chainda", "Chawama", "Mandevu", "Bauleni",
  "Makeni", "Zingalume", "Linda", "Kabanana", "Kafue", "Chongwe", "Mumbwa", "Mazabuka",
  "Monze", "Chipata", "Kasama", "Solwezi", "Ndola", "Kitwe", "Chingola", "Mufulira",
  "Kalulushi", "Kabwe", "Kapiri Mposhi", "Serenje", "Mkushi", "Petauke", "Katete",
  "Lundazi", "Mansa", "Kawambwa", "Nchelenge", "Chililabombwe", "Livingstone"
];

// Zambian phone prefixes
const phonePrefix = ["097", "096", "095", "077", "076", "075"];

// Relationships for witness
const relationships = [
  "Spouse", "Brother", "Sister", "Father", "Mother", "Son", "Daughter",
  "Uncle", "Aunt", "Cousin", "Friend", "Neighbor", "Business Partner"
];

// Plot sizes
const plotSizes = [
  "20x30m", "25x30m", "30x30m", "30x40m", "40x40m", "50x50m",
  "20x40m", "25x40m", "35x35m", "45x45m", "60x60m", "100x100m"
];

// Document types
const documentTypes = [
  "National Registration Card", "Passport", "Driver's License", "Voter's Card"
];

const contractTypes = [
  "Sale Agreement", "Lease Agreement", "Purchase Contract", "Transfer Document"
];

const otherDocTypes = [
  "Survey Report", "Site Plan", "Building Permit", "Title Deed", "Land Certificate"
];

// Helper functions
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateNRC(): string {
  const digits = Math.floor(Math.random() * 900000) + 100000;
  const suffix = Math.floor(Math.random() * 99) + 1;
  return `${digits}/${suffix.toString().padStart(2, '0')}/1`;
}

function generatePhone(): string {
  const prefix = getRandomItem(phonePrefix);
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `${prefix}${number}`;
}

function generateEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "zamtel.zm"];
  return `${cleanName}@${getRandomItem(domains)}`;
}

function generateAddress(location: string): string {
  const houseNumbers = Math.floor(Math.random() * 9999) + 1;
  const streets = [
    "Independence Avenue", "Cairo Road", "Church Road", "Nationalist Road",
    "Great East Road", "Kafue Road", "Mumbwa Road", "Chongwe Road",
    "University Road", "Thabo Mbeki Road", "Kenneth Kaunda Road", "Freedom Way"
  ];
  return `${houseNumbers} ${getRandomItem(streets)}, ${location}, Lusaka`;
}

function generatePlotNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(Math.random() * 9999) + 1;
  return `${letter}${number.toString().padStart(4, '0')}`;
}

function generateCost(): number {
  // Costs in ZMW (Zambian Kwacha) - realistic property prices
  const baseCost = Math.floor(Math.random() * 800000) + 200000; // 200k to 1M ZMW
  return baseCost;
}

function generateAmountPaid(totalCost: number): number {
  // Random percentage paid between 10% and 90%
  const percentage = Math.random() * 0.8 + 0.1;
  return Math.floor(totalCost * percentage);
}

function generateSiteName(): string {
  const siteNames = [
    "Golden Valley Estate", "Meanwood Estate", "Silverest Gardens", "Palm Grove Estate",
    "Sunset Gardens", "Green Valley", "Royal Gardens", "Paradise Estate", "Crown Estate",
    "Diamond Park", "Emerald Gardens", "Ruby Estate", "Sapphire Gardens", "Pearl Estate",
    "Highland Park", "Valley View Estate", "Hill Crest Gardens", "River View Estate",
    "Garden City", "New Town Estate", "Executive Lodge", "Presidential Estate"
  ];
  return getRandomItem(siteNames);
}

console.log("Starting database seeding with 200 Zambian records...");

// Prepare all the insert statements
const insertClient = db.prepare(`
  INSERT INTO clients (name, nrc, phone, email, address)
  VALUES (?, ?, ?, ?, ?)
`);

const insertPlot = db.prepare(`
  INSERT INTO plots (client_id, plot_number, plot_size, location, site_name, site_plan_link)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertSale = db.prepare(`
  INSERT INTO sales (client_id, total_cost, amount_paid, balance)
  VALUES (?, ?, ?, ?)
`);

const insertWitness = db.prepare(`
  INSERT INTO witness (client_id, name, nrc, phone, address, relationship)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertDocument = db.prepare(`
  INSERT INTO documents (client_id, id_copy, contract, other_doc)
  VALUES (?, ?, ?, ?)
`);

// Transaction to insert all data
const seedData = db.transaction(() => {
  for (let i = 0; i < 200; i++) {
    const clientName = getRandomItem(zambianNames);
    const location = getRandomItem(zambianLocations);

    // Insert client
    const clientResult = insertClient.run(
      clientName,
      generateNRC(),
      generatePhone(),
      generateEmail(clientName),
      generateAddress(location)
    );

    const clientId = clientResult.lastInsertRowid as number;

    // Insert plot
    insertPlot.run(
      clientId,
      generatePlotNumber(),
      getRandomItem(plotSizes),
      location,
      generateSiteName(),
      `https://siteplans.zm/plan-${clientId}.pdf`
    );

    // Insert sales
    const totalCost = generateCost();
    const amountPaid = generateAmountPaid(totalCost);
    const balance = totalCost - amountPaid;

    insertSale.run(
      clientId,
      totalCost,
      amountPaid,
      balance
    );

    // Insert witness
    const witnessName = getRandomItem(zambianNames);
    insertWitness.run(
      clientId,
      witnessName,
      generateNRC(),
      generatePhone(),
      generateAddress(getRandomItem(zambianLocations)),
      getRandomItem(relationships)
    );

    // Insert documents
    insertDocument.run(
      clientId,
      getRandomItem(documentTypes),
      getRandomItem(contractTypes),
      getRandomItem(otherDocTypes)
    );

    // Progress indicator
    if ((i + 1) % 50 === 0) {
      console.log(`Inserted ${i + 1} records...`);
    }
  }
});

try {
  seedData();
  console.log("✅ Successfully seeded database with 200 Zambian records!");
  console.log("📊 Database contains:");

  // Get counts to verify
  const clientCount = db.prepare("SELECT COUNT(*) as count FROM clients").get() as { count: number };
  const plotCount = db.prepare("SELECT COUNT(*) as count FROM plots").get() as { count: number };
  const salesCount = db.prepare("SELECT COUNT(*) as count FROM sales").get() as { count: number };
  const witnessCount = db.prepare("SELECT COUNT(*) as count FROM witness").get() as { count: number };
  const documentsCount = db.prepare("SELECT COUNT(*) as count FROM documents").get() as { count: number };

  console.log(`   - ${clientCount.count} clients`);
  console.log(`   - ${plotCount.count} plots`);
  console.log(`   - ${salesCount.count} sales records`);
  console.log(`   - ${witnessCount.count} witness records`);
  console.log(`   - ${documentsCount.count} document records`);

} catch (error) {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
}

// Close database connection
db.close();
console.log("Database connection closed.");
