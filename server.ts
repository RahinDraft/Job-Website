import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

let db: Database.Database;

async function startServer() {
  console.log("Starting server initialization...");
  try {
    db = new Database("jobs.db");
    console.log("Database connected.");
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }

  // Initialize Database
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        deadline TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        salary TEXT,
        companyLogoUrl TEXT,
        circularImageUrl TEXT,
        positions TEXT,
        applicationFee TEXT,
        searchKeywords TEXT,
        seoTitle TEXT,
        seoDescription TEXT,
        minEducationLevel INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        fullName TEXT,
        email TEXT,
        mobile TEXT,
        securityQuestion TEXT,
        securityAnswer TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        isOnline INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS site_stats (
        id INTEGER PRIMARY KEY,
        total_visitors INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS cvs (
        userId TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS saved_jobs (
        userId TEXT,
        jobId TEXT,
        savedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (userId, jobId),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (jobId) REFERENCES jobs(id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        jobId TEXT NOT NULL,
        selectedPost TEXT,
        transactionId TEXT,
        paymentMethod TEXT,
        status TEXT NOT NULL DEFAULT 'Ordered',
        statusHistory TEXT,
        amount TEXT NOT NULL,
        jobFee TEXT,
        serviceCharge TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        demoCopyUrl TEXT,
        finalCopyUrl TEXT,
        adminNote TEXT,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (jobId) REFERENCES jobs(id)
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        jobId TEXT NOT NULL,
        userId TEXT NOT NULL,
        userName TEXT NOT NULL,
        text TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (jobId) REFERENCES jobs(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS replies (
        id TEXT PRIMARY KEY,
        commentId TEXT NOT NULL,
        userId TEXT NOT NULL,
        userName TEXT NOT NULL,
        text TEXT NOT NULL,
        isAdmin INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (commentId) REFERENCES comments(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS service_requests (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        type TEXT NOT NULL,
        photoUrl TEXT,
        signatureUrl TEXT,
        processedPhotoUrl TEXT,
        processedSignatureUrl TEXT,
        transactionId TEXT NOT NULL,
        paymentMethod TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      INSERT OR IGNORE INTO site_stats (id, total_visitors) VALUES (1, 0);
      
      -- Default Settings
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('siteName', 'চাকরি সেবা');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('primaryColor', '#059669');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('contactPhone', '01700000000');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('contactEmail', 'info@chakriseba.com');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('noticeText', 'আমাদের সাইটে আপনাকে স্বাগতম! চাকরি সেবা - আপনার ক্যারিয়ারের বিশ্বস্ত সঙ্গী।');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('bkashNumber', '01700000000');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('nagadNumber', '01700000000');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('applicationFee', '১০০');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('heroTitle', 'আপনার স্বপ্নের চাকরি খুঁজুন');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('heroSubtitle', 'বাংলাদেশের সবচেয়ে বিশ্বস্ত চাকরি সেবা প্ল্যাটফর্ম');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footerText', '© 2026 চাকরি সেবা। সর্বস্বত্ব সংরক্ষিত।');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('facebookLink', '');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('youtubeLink', '');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('logoUrl', '');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('aboutText', 'আমরা বাংলাদেশের অন্যতম প্রধান চাকরি সেবা প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো চাকরিপ্রার্থী এবং নিয়োগকর্তাদের মধ্যে একটি সেতুবন্ধন তৈরি করা।');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('contactAddress', 'ঢাকা, বাংলাদেশ');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('paymentInstructions', 'নিচের যেকোনো নাম্বারে সেন্ড মানি করে Transaction ID (TrxID) দিন।');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('seoTitle', 'চাকরি সেবা - বাংলাদেশের ১ নম্বর চাকরির পোর্টাল | Chakri Seba');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('seoDescription', 'সরকারি ও বেসরকারি চাকরির সবশেষ সার্কুলার ও ঘরে বসে সহজে আবেদনের বিশ্বস্ত মাধ্যম।');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('serviceCharge', '50');
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('whatsappNumber', '01700000000');

      -- Force update existing settings to ensure the change is visible immediately
      UPDATE site_settings SET value = 'চাকরি সেবা' WHERE key = 'siteName';
      UPDATE site_settings SET value = 'বাংলাদেশের সবচেয়ে বিশ্বস্ত চাকরি সেবা প্ল্যাটফর্ম' WHERE key = 'heroSubtitle';
      UPDATE site_settings SET value = 'আমরা বাংলাদেশের অন্যতম প্রধান চাকরি সেবা প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো চাকরিপ্রার্থী এবং নিয়োগকর্তাদের মধ্যে একটি সেতুবন্ধন তৈরি করা।' WHERE key = 'aboutText';
      UPDATE site_settings SET value = 'চাকরি সেবা - বাংলাদেশের ১ নম্বর চাকরির পোর্টাল | Chakri Seba' WHERE key = 'seoTitle';
      UPDATE site_settings SET value = 'সরকারি ও বেসরকারি চাকরির সবশেষ সার্কুলার ও ঘরে বসে সহজে আবেদনের বিশ্বস্ত মাধ্যম।' WHERE key = 'seoDescription';
    `);
    console.log("Database tables initialized.");
  } catch (err) {
    console.error("Failed to initialize database tables:", err);
  }

  // Migration for existing tables if columns are missing
  const addColumn = (table: string, col: string, type: string = "TEXT") => {
    try {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
    } catch (e) {
      // Column might already exist
    }
  };

  // Jobs table migrations
  ['companyLogoUrl', 'circularImageUrl', 'positions', 'applicationFee', 'searchKeywords', 'seoTitle', 'seoDescription'].forEach(col => addColumn("jobs", col));
  addColumn("jobs", "createdAt", "DATETIME");
  addColumn("jobs", "minEducationLevel", "INTEGER DEFAULT 0");
  
  try { db.exec("UPDATE jobs SET createdAt = CURRENT_TIMESTAMP WHERE createdAt IS NULL"); } catch (e) {}
  
  // Orders table migrations
  ['statusHistory', 'selectedPost', 'demoCopyUrl', 'finalCopyUrl', 'adminNote', 'paymentMethod', 'jobFee', 'serviceCharge'].forEach(col => addColumn("orders", col));

  // Users table migrations
  ['fullName', 'email', 'mobile', 'securityQuestion', 'securityAnswer'].forEach(col => addColumn("users", col));
  addColumn("users", "createdAt", "DATETIME");
  addColumn("users", "isOnline", "INTEGER DEFAULT 0");

  try { db.exec("UPDATE users SET createdAt = CURRENT_TIMESTAMP WHERE createdAt IS NULL"); } catch (e) {}

  // Ensure admin exists
  try {
    const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
    if (!adminExists) {
      db.prepare("INSERT INTO users (id, username, password, role, fullName, mobile) VALUES (?, ?, ?, ?, ?, ?)").run(
        Math.random().toString(36).substr(2, 9),
        'admin',
        'admin123',
        'admin',
        'System Admin',
        '01700000000'
      );
    } else {
      // Force reset admin password to admin123 and username to admin in case it was changed and forgotten
      db.prepare("UPDATE users SET password = 'admin123', username = 'admin' WHERE role = 'admin'").run();
    }
    console.log("Admin user verified and credentials reset to admin/admin123.");
  } catch (err) {
    console.error("Failed to verify admin user:", err);
  }

  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  // Track active visitors
  let activeVisitors = 0;
  const onlineUsers = new Map<string, WebSocket>();

  wss.on("connection", (ws) => {
    activeVisitors++;
    let currentUserId: string | null = null;

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "AUTH" && data.userId) {
          currentUserId = data.userId;
          onlineUsers.set(currentUserId, ws);
          db.prepare("UPDATE users SET isOnline = 1 WHERE id = ?").run(currentUserId);
        }
      } catch (e) {}
    });

    ws.on("close", () => {
      activeVisitors--;
      if (currentUserId) {
        onlineUsers.delete(currentUserId);
        db.prepare("UPDATE users SET isOnline = 0 WHERE id = ?").run(currentUserId);
      }
    });
  });

  // Increment total visitors
  app.use((req, res, next) => {
    if (req.path === "/" || req.path === "/index.html") {
      db.prepare("UPDATE site_stats SET total_visitors = total_visitors + 1 WHERE id = 1").run();
    }
    next();
  });

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

  // File Upload Route
  app.post("/api/upload", upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Auth Routes
  app.get("/api/users", (req, res) => {
    try {
      const users = db.prepare("SELECT id, username, password, role, fullName, email, mobile, createdAt, isOnline FROM users").all();
      console.log(`Fetched ${users.length} users with all columns`);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users with all columns:", error);
      // Fallback to basic columns if new ones fail
      try {
        const users = db.prepare("SELECT id, username, password, role, fullName, email, mobile FROM users").all();
        console.log(`Fetched ${users.length} users with basic columns`);
        res.json(users);
      } catch (innerError) {
        console.error("Error fetching users with basic columns:", innerError);
        res.status(500).json({ error: "ইউজার লিস্ট লোড করা সম্ভব হয়নি" });
      }
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    const stats = db.prepare("SELECT total_visitors FROM site_stats WHERE id = 1").get() as any;
    const registeredUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const loggedInUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE isOnline = 1").get() as any;
    const newMessages = db.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'").get() as any;
    
    res.json({
      totalVisitors: stats?.total_visitors || 0,
      activeVisitors,
      registeredUsers: registeredUsers?.count || 0,
      loggedInUsers: loggedInUsers?.count || 0,
      newMessages: newMessages?.count || 0
    });
  });

  app.put("/api/users/:id/password", (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "পাসওয়ার্ড দিন" });
    try {
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(password, id);
      res.json({ message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে" });
    } catch (error) {
      res.status(500).json({ error: "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি" });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    try {
      const result = db.prepare("DELETE FROM users WHERE id = ? AND role != 'admin'").run(id);
      if (result.changes > 0) {
        res.json({ message: "ইউজার সফলভাবে ডিলিট করা হয়েছে" });
      } else {
        res.status(404).json({ error: "ইউজার পাওয়া যায়নি অথবা আপনি এডমিন ডিলিট করতে পারবেন না" });
      }
    } catch (error) {
      res.status(500).json({ error: "ইউজার ডিলিট করা সম্ভব হয়নি" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { username, password, fullName, email, mobile, securityQuestion, securityAnswer } = req.body;
    
    // Validation
    if (!username || !password || !fullName || !mobile || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: "সবগুলো প্রয়োজনীয় তথ্য দিন (নাম, মোবাইল, সিকিউরিটি প্রশ্ন ও উত্তর)" });
    }

    if (!/^01\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: "আপনার ১১ ডিজিটের মোবাইল নাম্বারটির শুরুতে 01 লিখুন" });
    }

    const id = Math.random().toString(36).substr(2, 9);
    try {
      // Check if mobile already exists
      const existingMobile = db.prepare("SELECT * FROM users WHERE mobile = ?").get(mobile);
      if (existingMobile) {
        return res.status(400).json({ error: "এই মোবাইল নাম্বারটি দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে। দয়া করে লগইন করুন অথবা পাসওয়ার্ড ভুলে গেলে ফরগ্যাট অপশন ব্যবহার করুন।" });
      }

      db.prepare("INSERT INTO users (id, username, password, role, fullName, email, mobile, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
        id, username, password, 'user', fullName, email || null, mobile, securityQuestion, securityAnswer
      );
      res.status(201).json({ id, username, role: 'user', fullName, email, mobile });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে" });
      } else {
        res.status(500).json({ error: "রেজিস্ট্রেশন ব্যর্থ হয়েছে" });
      }
    }
  });

  app.post("/api/forgot-password", (req, res) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: "মোবাইল নাম্বার দিন" });
    
    const user = db.prepare("SELECT securityQuestion FROM users WHERE mobile = ?").get(mobile) as any;
    if (user) {
      res.json({ question: user.securityQuestion });
    } else {
      res.status(404).json({ error: "এই মোবাইল নাম্বারটি আমাদের সিস্টেমে পাওয়া যায়নি।" });
    }
  });

  app.post("/api/verify-security-answer", (req, res) => {
    const { mobile, answer } = req.body;
    if (!mobile || !answer) return res.status(400).json({ error: "সবগুলো তথ্য দিন" });

    const user = db.prepare("SELECT username, password FROM users WHERE mobile = ? AND LOWER(securityAnswer) = LOWER(?)").get(mobile, answer) as any;
    if (user) {
      res.json({ 
        username: user.username, 
        password: user.password,
        message: "আপনার তথ্য নিচে দেওয়া হলো। দয়া করে এটি লিখে রাখুন।" 
      });
    } else {
      res.status(400).json({ error: "ভুল উত্তর! দয়া করে সঠিক উত্তর দিন।" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile
      });
    } else {
      res.status(401).json({ error: "ভুল ইউজারনেম বা পাসওয়ার্ড!" });
    }
  });

  // API Routes
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare("SELECT * FROM jobs ORDER BY createdAt DESC").all();
    res.json(jobs.map((j: any) => ({ 
      ...j, 
      requirements: JSON.parse(j.requirements),
      positions: j.positions ? JSON.parse(j.positions) : [],
      searchKeywords: j.searchKeywords || '',
      seoTitle: j.seoTitle || '',
      seoDescription: j.seoDescription || ''
    })));
  });

  app.post("/api/jobs", (req, res) => {
    const { title, company, category, location, deadline, description, requirements, salary, companyLogoUrl, circularImageUrl, positions, applicationFee, searchKeywords, seoTitle, seoDescription } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      db.prepare(`
        INSERT INTO jobs (id, title, company, category, location, deadline, description, requirements, salary, companyLogoUrl, circularImageUrl, positions, applicationFee, searchKeywords, seoTitle, seoDescription)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, company, category, location, deadline, description, JSON.stringify(requirements), salary, companyLogoUrl, circularImageUrl, JSON.stringify(positions || []), applicationFee, searchKeywords || '', seoTitle || '', seoDescription || '');
      res.status(201).json({ id, title, company, category, location, deadline, description, requirements, salary, companyLogoUrl, circularImageUrl, positions, applicationFee, searchKeywords, seoTitle, seoDescription });
    } catch (error) {
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const { title, company, category, location, deadline, description, requirements, salary, companyLogoUrl, circularImageUrl, positions, applicationFee, searchKeywords, seoTitle, seoDescription } = req.body;
    try {
      db.prepare(`
        UPDATE jobs 
        SET title = ?, company = ?, category = ?, location = ?, deadline = ?, description = ?, requirements = ?, salary = ?, companyLogoUrl = ?, circularImageUrl = ?, positions = ?, applicationFee = ?, searchKeywords = ?, seoTitle = ?, seoDescription = ?
        WHERE id = ?
      `).run(title, company, category, location, deadline, description, JSON.stringify(requirements), salary, companyLogoUrl, circularImageUrl, JSON.stringify(positions || []), applicationFee, searchKeywords || '', seoTitle || '', seoDescription || '', id);
      res.json({ id, title, company, category, location, deadline, description, requirements, salary, companyLogoUrl, circularImageUrl, positions, applicationFee, searchKeywords, seoTitle, seoDescription });
    } catch (error) {
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.delete("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  app.get("/api/stats", (req, res) => {
    const total = db.prepare("SELECT COUNT(*) as count FROM jobs").get() as any;
    const byCategory = db.prepare("SELECT category, COUNT(*) as count FROM jobs GROUP BY category").all();
    res.json({ total: total.count, byCategory });
  });

  // Saved Jobs Routes
  app.get("/api/users/:userId/saved-jobs", (req, res) => {
    const { userId } = req.params;
    try {
      const savedJobs = db.prepare(`
        SELECT jobs.*, saved_jobs.savedAt 
        FROM jobs 
        JOIN saved_jobs ON jobs.id = saved_jobs.jobId 
        WHERE saved_jobs.userId = ?
      `).all(userId);
      res.json(savedJobs.map((j: any) => ({ ...j, requirements: JSON.parse(j.requirements) })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved jobs" });
    }
  });

  app.post("/api/users/:userId/saved-jobs", (req, res) => {
    const { userId } = req.params;
    const { jobId } = req.body;
    try {
      db.prepare("INSERT OR IGNORE INTO saved_jobs (userId, jobId) VALUES (?, ?)").run(userId, jobId);
      res.json({ message: "Job saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save job" });
    }
  });

  app.delete("/api/users/:userId/saved-jobs/:jobId", (req, res) => {
    const { userId, jobId } = req.params;
    try {
      db.prepare("DELETE FROM saved_jobs WHERE userId = ? AND jobId = ?").run(userId, jobId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to unsave job" });
    }
  });

  // CV Routes
  app.get("/api/cv/:userId", (req, res) => {
    const { userId } = req.params;
    try {
      const cv = db.prepare("SELECT data FROM cvs WHERE userId = ?").get(userId) as any;
      if (cv) {
        res.json(JSON.parse(cv.data));
      } else {
        res.status(404).json({ error: "CV not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch CV" });
    }
  });

  app.post("/api/cv/:userId", (req, res) => {
    const { userId } = req.params;
    const data = req.body;
    try {
      db.prepare("INSERT OR REPLACE INTO cvs (userId, data) VALUES (?, ?)").run(userId, JSON.stringify(data));
      res.json({ message: "CV saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save CV" });
    }
  });

  app.get("/api/admin/cv/:userId/download", (req, res) => {
    const { userId } = req.params;
    try {
      const cv = db.prepare("SELECT data FROM cvs WHERE userId = ?").get(userId) as any;
      if (cv) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=cv_${userId}.json`);
        res.send(cv.data);
      } else {
        res.status(404).json({ error: "CV not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch CV" });
    }
  });

  // Service Request Routes
  app.post("/api/service-requests", upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
  ]), (req, res) => {
    const { userId, type, transactionId, paymentMethod } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const id = Math.random().toString(36).substr(2, 9);
    const photoUrl = files['photo'] ? `/uploads/${files['photo'][0].filename}` : null;
    const signatureUrl = files['signature'] ? `/uploads/${files['signature'][0].filename}` : null;

    try {
      db.prepare(`
        INSERT INTO service_requests (id, userId, type, photoUrl, signatureUrl, transactionId, paymentMethod)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, userId, type, photoUrl, signatureUrl, transactionId, paymentMethod);
      res.status(201).json({ id, status: 'Pending' });
    } catch (error) {
      console.error("Failed to create service request:", error);
      res.status(500).json({ error: "Failed to submit request" });
    }
  });

  app.get("/api/service-requests", (req, res) => {
    try {
      const requests = db.prepare(`
        SELECT sr.*, u.fullName, u.mobile 
        FROM service_requests sr
        JOIN users u ON sr.userId = u.id
        ORDER BY sr.createdAt DESC
      `).all();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service requests" });
    }
  });

  app.get("/api/my-service-requests/:userId", (req, res) => {
    const { userId } = req.params;
    try {
      const requests = db.prepare("SELECT * FROM service_requests WHERE userId = ? ORDER BY createdAt DESC").all(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch your requests" });
    }
  });

  app.put("/api/service-requests/:id", upload.fields([
    { name: 'processedPhoto', maxCount: 1 },
    { name: 'processedSignature', maxCount: 1 }
  ]), (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    try {
      let query = "UPDATE service_requests SET status = ?";
      const params: any[] = [status];

      if (files['processedPhoto']) {
        query += ", processedPhotoUrl = ?";
        params.push(`/uploads/${files['processedPhoto'][0].filename}`);
      }
      if (files['processedSignature']) {
        query += ", processedSignatureUrl = ?";
        params.push(`/uploads/${files['processedSignature'][0].filename}`);
      }

      query += " WHERE id = ?";
      params.push(id);

      db.prepare(query).run(...params);
      res.json({ message: "Request updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // Orders Routes
  app.get("/api/orders", (req, res) => {
    try {
      const orders = db.prepare(`
        SELECT o.*, j.title as jobTitle, j.company, u.username as userName, u.mobile as userMobile
        FROM orders o
        JOIN jobs j ON o.jobId = j.id
        JOIN users u ON o.userId = u.id
        ORDER BY o.createdAt DESC
      `).all() as any[];
      res.json(orders.map(o => ({
        ...o,
        statusHistory: o.statusHistory ? JSON.parse(o.statusHistory) : []
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/users/:userId/orders", (req, res) => {
    const { userId } = req.params;
    try {
      const orders = db.prepare(`
        SELECT o.*, j.title as jobTitle, j.company
        FROM orders o
        JOIN jobs j ON o.jobId = j.id
        WHERE o.userId = ?
        ORDER BY o.createdAt DESC
      `).all(userId) as any[];
      res.json(orders.map(o => ({
        ...o,
        statusHistory: o.statusHistory ? JSON.parse(o.statusHistory) : []
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { id, userId, jobId, selectedPost, amount, jobFee, serviceCharge } = req.body;

    try {
      // 1. Get Job details for education requirement
      const job = db.prepare("SELECT title, minEducationLevel FROM jobs WHERE id = ?").get(jobId) as any;
      if (!job) return res.status(404).json({ error: "Job not found" });

      // 2. Fetch User's CV
      const cvRow = db.prepare("SELECT data FROM cvs WHERE userId = ?").get(userId) as any;
      
      const eduMapping: { [key: string]: number } = {
        'SSC/Equivalent Level': 1,
        'HSC/Equivalent Level': 2,
        'Graduation/Equivalent Level': 3,
        'Masters/Equivalent Level': 4
      };

      const levelLabels: { [key: number]: string } = {
        1: 'এসএসসি / সমমান (SSC)',
        2: 'এইচএসসি / সমমান (HSC)',
        3: 'স্নাতক / সমমান (Graduation)',
        4: 'স্নাতকোত্তর / সমমান (Masters)'
      };

      if (job.minEducationLevel > 0) {
        if (!cvRow) {
          return res.status(400).json({ 
            error: `দুঃখিত, এই পদে আবেদন করতে হলে আপনার সিভিতে কমপক্ষে "${levelLabels[job.minEducationLevel]}" যুক্ত থাকতে হবে। অনুগ্রহ করে আগে আপনার সিভি তৈরি করুন।` 
          });
        }

        const cvData = JSON.parse(cvRow.data);
        const userEdu = cvData.education || [];
        
        // Find user's highest education level
        let userMaxLevel = 0;
        userEdu.forEach((edu: any) => {
          const levelVal = eduMapping[edu.level] || 0;
          if (levelVal > userMaxLevel) {
            userMaxLevel = levelVal;
          }
        });

        if (userMaxLevel < job.minEducationLevel) {
          const user = db.prepare("SELECT fullName FROM users WHERE id = ?").get(userId) as any;
          return res.status(400).json({ 
            error: `প্রিয় ${user?.fullName || 'ইউজার'}, আপনার সিভিতে এই পদের জন্য প্রয়োজনীয় ন্যূনতম শিক্ষাগত যোগ্যতা ("${levelLabels[job.minEducationLevel]}") যুক্ত করা নেই। যদি আপনার এই শিক্ষাগত যোগ্যতা থাকে, তবে দয়া করে আপনার ড্যাশবোর্ড থেকে সিভি আপডেট করে পুনরায় আবেদনের চেষ্টা করুন।` 
          });
        }
      }

      // Check for duplicate order
      const existingOrder = db.prepare(`
        SELECT id FROM orders 
        WHERE userId = ? AND jobId = ? AND (selectedPost = ? OR (selectedPost IS NULL AND ? IS NULL))
      `).get(userId, jobId, selectedPost || null, selectedPost || null);

      if (existingOrder) {
        const user = db.prepare("SELECT fullName FROM users WHERE id = ?").get(userId) as any;
        return res.status(400).json({ 
          error: `প্রিয় ${user?.fullName || 'ইউজার'}, আপনি ইতোমধ্যে এই চাকরির উক্ত পদে আবেদনের জন্য অর্ডার করেছেন। অনুগ্রহ করে আপনার ড্যাশবোর্ড চেক করুন অথবা অন্য পদে আবেদনের জন্য অর্ডার করুন` 
        });
      }

      const initialHistory = JSON.stringify([{
        status: 'Ordered',
        timestamp: new Date().toISOString(),
        note: 'অর্ডার গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার হয়ে আবেদন শুরু করব।'
      }]);
      
      db.prepare(`
        INSERT INTO orders (id, userId, jobId, selectedPost, transactionId, paymentMethod, amount, jobFee, serviceCharge, status, statusHistory)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ordered', ?)
      `).run(id, userId, jobId, selectedPost || null, '', '', amount, jobFee || '0', serviceCharge || '0', initialHistory);
      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/orders/:orderId/payment", (req, res) => {
    const { orderId } = req.params;
    const { transactionId, paymentMethod } = req.body;
    try {
      const order = db.prepare("SELECT statusHistory FROM orders WHERE id = ?").get(orderId) as any;
      if (!order) return res.status(404).json({ error: "Order not found" });
      
      const history = order.statusHistory ? JSON.parse(order.statusHistory) : [];
      history.push({
        status: 'Payment Sent',
        timestamp: new Date().toISOString(),
        note: `পেমেন্ট তথ্য জমাদিন করা হয়েছে (TrxID: ${transactionId}, Method: ${paymentMethod})`
      });

      db.prepare(`
        UPDATE orders 
        SET transactionId = ?, paymentMethod = ?, status = ?, statusHistory = ? 
        WHERE id = ?
      `).run(transactionId, paymentMethod, 'Payment Sent', JSON.stringify(history), orderId);
      
      res.json({ message: "Payment info submitted successfully" });
    } catch (error) {
      console.error("Failed to update order payment:", error);
      res.status(500).json({ error: "Failed to update payment info" });
    }
  });

  app.put("/api/orders/:orderId/status", (req, res) => {
    const { orderId } = req.params;
    const { status, note, demoCopyUrl, finalCopyUrl, adminNote } = req.body;
    try {
      const order = db.prepare("SELECT statusHistory FROM orders WHERE id = ?").get(orderId) as any;
      if (!order) return res.status(404).json({ error: "Order not found" });

      const history = order.statusHistory ? JSON.parse(order.statusHistory) : [];
      
      const statusLabels: { [key: string]: string } = {
        'Ordered': 'অর্ডার করা হয়েছে',
        'Demo Sent': 'ডেমো কপি পাঠানো হয়েছে',
        'Payment Sent': 'পেমেন্ট করা হয়েছে',
        'Completed': 'সম্পন্ন',
        'Rejected': 'বাতিল'
      };

      history.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `${statusLabels[status] || status} অবস্থায় পরিবর্তন করা হয়েছে`
      });

      let query = "UPDATE orders SET status = ?, statusHistory = ?";
      const params: any[] = [status, JSON.stringify(history)];

      if (demoCopyUrl !== undefined) {
        query += ", demoCopyUrl = ?";
        params.push(demoCopyUrl);
      }
      if (finalCopyUrl !== undefined) {
        query += ", finalCopyUrl = ?";
        params.push(finalCopyUrl);
      }
      if (adminNote !== undefined) {
        query += ", adminNote = ?";
        params.push(adminNote);
      }

      query += " WHERE id = ?";
      params.push(orderId);

      db.prepare(query).run(...params);
      res.json({ message: "Order status updated" });
    } catch (error) {
      console.error("Failed to update order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.get("/api/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM site_settings").all();
      const settingsObj = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", (req, res) => {
    const settings = req.body;
    try {
      const stmt = db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)");
      const transaction = db.transaction((data) => {
        for (const [key, value] of Object.entries(data)) {
          stmt.run(key, String(value));
        }
      });
      transaction(settings);
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Comments & Replies API
  app.get("/api/jobs/:jobId/comments", (req, res) => {
    const { jobId } = req.params;
    try {
      const comments = db.prepare("SELECT * FROM comments WHERE jobId = ? ORDER BY createdAt DESC").all(jobId) as any[];
      const commentsWithReplies = comments.map(comment => {
        const replies = db.prepare("SELECT * FROM replies WHERE commentId = ? ORDER BY createdAt ASC").all(comment.id) as any[];
        return {
          ...comment,
          replies: replies.map(r => ({ ...r, isAdmin: Boolean(r.isAdmin) }))
        };
      });
      res.json(commentsWithReplies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/jobs/:jobId/comments", (req, res) => {
    const { jobId } = req.params;
    const { userId, userName, text } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      db.prepare("INSERT INTO comments (id, jobId, userId, userName, text) VALUES (?, ?, ?, ?, ?)").run(id, jobId, userId, userName, text);
      res.status(201).json({ id, jobId, userId, userName, text, createdAt: new Date().toISOString(), replies: [] });
    } catch (error) {
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  app.post("/api/comments/:commentId/replies", (req, res) => {
    const { commentId } = req.params;
    const { userId, userName, text, isAdmin } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      db.prepare("INSERT INTO replies (id, commentId, userId, userName, text, isAdmin) VALUES (?, ?, ?, ?, ?, ?)").run(id, commentId, userId, userName, text, isAdmin ? 1 : 0);
      res.status(201).json({ id, commentId, userId, userName, text, isAdmin, createdAt: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ error: "Failed to add reply" });
    }
  });

  // Contact Messages API
  app.get("/api/contact", (req, res) => {
    try {
      const messages = db.prepare("SELECT * FROM contact_messages ORDER BY createdAt DESC").all();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      db.prepare("INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)").run(id, name, email, subject, message);
      res.status(201).json({ id, name, email, subject, message, status: 'new', createdAt: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.put("/api/contact/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      db.prepare("UPDATE contact_messages SET status = ? WHERE id = ?").run(status, id);
      res.json({ message: "Message status updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update message status" });
    }
  });

  app.delete("/api/contact/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
