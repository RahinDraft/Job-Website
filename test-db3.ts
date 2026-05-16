import Database from "better-sqlite3";

const db = new Database("jobs.db");

try {
  const users = db.prepare("SELECT id, username, password, role, fullName, email, mobile FROM users").all();
  console.log("Fallback Users:", users);
} catch (e) {
  console.error("Error:", e);
}
