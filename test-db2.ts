import Database from "better-sqlite3";

const db = new Database("jobs.db");

try {
  db.exec(`ALTER TABLE users ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP`);
  console.log("Success");
} catch (e) {
  console.error("Error:", e);
}
