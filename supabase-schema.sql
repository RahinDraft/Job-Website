-- SQL script to setup Chakri_Seba database on Supabase
-- Paste this script in your Supabase project under SQL Editor and click 'Run'.

-- 0. Disable Row-Level Security (RLS) on all tables to allow the app to insert/query data
-- (Alternatively, you can create permissive RLS policies, but disabling RLS is the simplest way to get up and running instantly)
ALTER TABLE IF EXISTS jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cvs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saved_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS replies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_requests DISABLE ROW LEVEL SECURITY;

-- 1. Create Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  deadline TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL, -- Stored as JSON string
  salary TEXT,
  "companyLogoUrl" TEXT,
  "circularImageUrl" TEXT,
  positions TEXT, -- Stored as JSON string
  "applicationFee" TEXT,
  "searchKeywords" TEXT,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "minEducationLevel" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  "fullName" TEXT,
  email TEXT,
  mobile TEXT UNIQUE,
  "securityQuestion" TEXT,
  "securityAnswer" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "isOnline" INTEGER DEFAULT 0
);

-- 3. Create Site Stats table
CREATE TABLE IF NOT EXISTS site_stats (
  id INTEGER PRIMARY KEY,
  total_visitors INTEGER DEFAULT 0
);

-- 4. Create CVs table
CREATE TABLE IF NOT EXISTS cvs (
  "userId" TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data TEXT NOT NULL
);

-- 5. Create Saved Jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  "jobId" TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  "savedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("userId", "jobId")
);

-- 6. Create Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  "jobId" TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  "selectedPost" TEXT,
  "transactionId" TEXT,
  "paymentMethod" TEXT,
  status TEXT NOT NULL DEFAULT 'Ordered',
  "statusHistory" TEXT, -- Stored as JSON string
  amount TEXT NOT NULL,
  "jobFee" TEXT,
  "serviceCharge" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "demoCopyUrl" TEXT,
  "finalCopyUrl" TEXT,
  "adminNote" TEXT
);

-- 7. Create Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 8. Create Comments table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  "jobId" TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  text TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Replies table
CREATE TABLE IF NOT EXISTS replies (
  id TEXT PRIMARY KEY,
  "commentId" TEXT REFERENCES comments(id) ON DELETE CASCADE,
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  text TEXT NOT NULL,
  "isAdmin" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create Service Requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  "photoUrl" TEXT,
  "signatureUrl" TEXT,
  "processedPhotoUrl" TEXT,
  "processedSignatureUrl" TEXT,
  "transactionId" TEXT NOT NULL,
  "paymentMethod" TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed metadata, admin and settings
INSERT INTO site_stats (id, total_visitors) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Default Settings
INSERT INTO site_settings (key, value) VALUES 
  ('siteName', 'চাকরি সেবা'),
  ('primaryColor', '#059669'),
  ('contactPhone', '01700000000'),
  ('contactEmail', 'info@chakriseba.com'),
  ('noticeText', 'আমাদের সাইটে আপনাকে স্বাগত! চাকরি সেবা - আপনার ক্যারিয়ারের বিশ্বস্ত সঙ্গী।'),
  ('bkashNumber', '01700000000'),
  ('nagadNumber', '01700000000'),
  ('applicationFee', '১০০'),
  ('heroTitle', 'আপনার স্বপ্নের চাকরি খুঁজুন'),
  ('heroSubtitle', 'বাংলাদেশের সবচেয়ে বিশ্বস্ত চাকরি সেবা প্ল্যাটফর্ম'),
  ('footerText', '© 2026 চাকরি সেবা। সর্বস্বত্ব সংরক্ষিত।'),
  ('facebookLink', ''),
  ('youtubeLink', ''),
  ('logoUrl', ''),
  ('aboutText', 'আমরা বাংলাদেশের অন্যতম প্রধান চাকরি সেবা প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো চাকরিপ্রার্থী এবং নিয়োগকর্তাদের মধ্যে একটি সেতুবন্ধন তৈরি করা।'),
  ('contactAddress', 'ঢাকা, বাংলাদেশ'),
  ('paymentInstructions', 'নিচের যেকোনো নাম্বারে সেন্ড মানি করে Transaction ID (TrxID) দিন।'),
  ('seoTitle', 'চাকরি সেবা - বাংলাদেশের ১ নম্বর চাকরির পোর্টাল | Chakri Seba'),
  ('seoDescription', 'সরকারি ও বেসরকারি চাকরির সবশেষ সার্কুলার ও ঘরে বসে সহজে আবেদনের বিশ্বস্ত মাধ্যম।'),
  ('serviceCharge', '50'),
  ('whatsappNumber', '01700000000')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Ensure admin user exists with credentials: admin / admin123
INSERT INTO users (id, username, password, role, "fullName", mobile)
VALUES ('admin-id-1234', 'admin', 'admin123', 'admin', 'System Admin', '01700000000')
ON CONFLICT (username) DO UPDATE SET password = 'admin123';

-- 12. Disable Row-Level Security (RLS) on all generated tables
ALTER TABLE IF EXISTS jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cvs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saved_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS replies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_requests DISABLE ROW LEVEL SECURITY;

