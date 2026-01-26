import db from "./db/db.js"; // Your better-sqlite3 connection

// Interfaces for type safety
interface ZambianData {
  maleNames: string[];
  femaleNames: string[];
  locations: string[];
}

// Zambian data
const zambianData: ZambianData = {
  maleNames: [
    "Mulenga",
    "Banda",
    "Phiri",
    "Mwape",
    "Kaluba",
    "Mweetwa",
    "Chimfwembe",
    "Sikazwe",
    "Lungu",
    "Kabwe",
  ],
  femaleNames: [
    "Nakawastina",
    "Chileshe",
    "Lweendo",
    "Mutinta",
    "Bwalya",
    "Namasiku",
    "Mwewa",
    "Mutale",
    "Chanda",
  ],
  locations: [
    "Off Leopards Hill Rd, Lusaka East",
    "Twin Palms, Meanwood, Lusaka",
    "Ngwerere Rd, Lusaka",
  ],
};

// Helper functions with explicit return types
function randomPhone(): string {
  const prefixes = ["0977", "0978", "0955", "0966"];
  return `${prefixes[Math.floor(Math.random() * 4)]}${Math.floor(1000000 + Math.random() * 9000000)}`;
}

function randomNRC(): string {
  return `${20000000 + Math.floor(Math.random() * 5000000)}
    /${Math.floor(10 + Math.random() * 60)}/${Math.floor(1 + Math.random() * 9)}`;
}

function randomName(): string {
  const isMale = Math.random() > 0.5;
  const names = isMale ? zambianData.maleNames : zambianData.femaleNames;
  return `${names[Math.floor(Math.random() * 10)]} ${names[Math.floor(Math.random() * 10)]}`;
}

function randomSize(): number {
  return Math.floor(1200 + Math.random() * 800);
}

function randomStatus(): "available" | "reserved" | "sold" {
  const r = Math.random();
  return r < 0.8 ? "available" : r < 0.9 ? "reserved" : "sold";
}

function randomTotal(): number {
  return Math.floor(50000 + Math.random() * 50000);
}

function randomPaid(total: number): number {
  return Math.floor(total * (0.2 + Math.random() * 0.8));
}

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Prepared statements with explicit types
const insertSeller = db.prepare(
  "INSERT INTO sellers (name, phone, total, paid) VALUES (?, ?, 0, 0)",
);
const insertSite = db.prepare(
  "INSERT INTO sites (seller_id, name, size, location, number_of_plots) VALUES (?, ?, ?, ?, ?)",
);
const insertPlot = db.prepare(
  "INSERT INTO plots (site_id, size, plot_no, status) VALUES (?, ?, ?, ?)",
);
const insertClient = db.prepare(
  "INSERT INTO clients (name, nrc, phone, is_allocated, is_authorized) VALUES (?, ?, ?, ?, ?)",
);
const insertSale = db.prepare(
  "INSERT INTO sales (client_id, plot_id, total, paid) VALUES (?, ?, ?, ?)",
);
const insertAdmin = db.prepare(
  "INSERT INTO admin (name, email, role) VALUES (?, ?, ?)",
);

try {
  console.log("🌱 Seeding Zambian real estate data...");

  // Sellers (5)
  console.log("Inserting 5 sellers...");
  for (let i = 0; i < 5; i++) {
    insertSeller.run(randomName(), randomPhone());
  }

  // Sites (3)
  console.log("Inserting 3 sites...");
  const sites: [number, string, string, string, number][] = [
    [1, "Lusaka East Gardens", "10 ha", zambianData.locations[0], 70],
    [2, "Meanwood Heights", "5 ha", zambianData.locations[1], 70],
    [3, "Ngwerere Park", "8 ha", zambianData.locations[2], 60],
  ];
  sites.forEach((site) => insertSite.run(...site));

  // Plots (200)
  console.log("Inserting 200 plots...");
  const prefixes = ["P", "M", "N"] as const;
  const nums = [70, 70, 60] as const;
  for (let site = 1; site <= 3; site++) {
    for (let p = 1; p <= nums[site - 1]; p++) {
      const plotno = `${prefixes[site - 1]}${p.toString().padStart(3, "0")}`;
      insertPlot.run(site, randomSize(), plotno, randomStatus());
    }
  }

  // Clients (150)
  console.log("Inserting 150 clients...");
  for (let i = 0; i < 150; i++) {
    const isalloc = Math.random() > 0.7 ? 1 : 0;
    insertClient.run(
      randomName(),
      randomNRC(),
      randomPhone(),
      isalloc,
      isalloc,
    );
  }

  // Sales (40)
  console.log("Inserting 40 sales...");
  for (let i = 0; i < 40; i++) {
    const clientid = Math.floor(1 + Math.random() * 150);
    const plotid = Math.floor(1 + Math.random() * 200);
    const total = randomTotal();
    insertSale.run(clientid, plotid, total, randomPaid(total));
  }

  // Admin (1)
  console.log("Inserting admin...");
  insertAdmin.run("Admin User", "admin@zambiarealtor.zm", "admin");

  console.log(
    "✅ Seeding complete! ~200 records added (plots:200, clients:150, sales:40).",
  );
} catch (error) {
  console.error("❌ Seeding failed:", error);
} finally {
  db.close();
}
