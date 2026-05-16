import Database from "better-sqlite3";

const db = new Database("jobs.db");

try {
  const users = db.prepare("SELECT * FROM users").all();
  console.log("Users:", users);
} catch (e) {
  console.error("Error:", e);
}
