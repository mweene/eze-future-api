import db from "./db/db.js";

const getAllSites = () => {
    const stmt = db.prepare("SELECT * FROM sites");
    const sites = stmt.all();
    console.log(sites);
};

getAllSites();
