import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import multer from "multer";
import fs from "fs";
import { dbClient } from "./db-client.js";

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

async function startServer() {
  console.log("🚀 Starting Chakri_Seba server with Supabase + SQLite Hybrid DB connection...");

  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  // Track active visitors & online users
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
          dbClient.updateOnlineStatus(currentUserId, 1).then();
        }
      } catch (e) {}
    });

    ws.on("close", () => {
      activeVisitors--;
      if (currentUserId) {
        onlineUsers.delete(currentUserId);
        dbClient.updateOnlineStatus(currentUserId, 0).then();
      }
    });
  });

  // Increment total visitors page views
  app.use((req, res, next) => {
    if (req.path === "/" || req.path === "/index.html") {
      dbClient.incrementPageViews().catch(console.error);
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
  app.get("/api/users", async (req, res) => {
    try {
      const users = await dbClient.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "ইউজার লিস্ট লোড করা সম্ভব হয়নি" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const messages = await dbClient.getContactMessages();
      const newMessagesCount = messages ? messages.filter((m: any) => m.status === 'new').length : 0;
      const stats = await dbClient.getAdminStats(activeVisitors, newMessagesCount);
      res.json(stats);
    } catch (error) {
      console.error("Error getting admin stats:", error);
      res.status(500).json({ error: "Failed to retrieve stats" });
    }
  });

  app.put("/api/users/:id/password", async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "পাসওয়ার্ড দিন" });
    try {
      await dbClient.updateUserPassword(id, password);
      res.json({ message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { fullName, mobile, role, password } = req.body;
    try {
      if (mobile && !/^01\d{9}$/.test(mobile)) {
        return res.status(400).json({ error: "আপনার ১১ ডিজিটের মোবাইল নাম্বারটির শুরুতে 01 লিখুন" });
      }
      await dbClient.updateUser(id, { fullName, mobile, role, password });
      res.json({ message: "ইউজার সফলভাবে আপডেট করা হয়েছে" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "ইউজার আপডেট করা সম্ভব হয়নি" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const users = await dbClient.getUsers();
      const user = users.find((u: any) => u.id === id);
      if (user?.role === 'admin') {
        return res.status(400).json({ error: "আপনি এডমিন ডিলিট করতে পারবেন না" });
      }

      await dbClient.deleteUser(id);
      res.json({ message: "ইউজার সফলভাবে ডিলিট করা হয়েছে" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "ইউজার ডিলিট করা সম্ভব হয়নি" });
    }
  });

  app.post("/api/register", async (req, res) => {
    const { username, password, fullName, email, mobile, securityQuestion, securityAnswer } = req.body;
    
    // Validation
    if (!username || !password || !fullName || !mobile || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: "সবগুলো প্রয়োজনীয় তথ্য দিন (নাম, মোবাইল, সিকিউরিটি প্রশ্ন ও উত্তর)" });
    }

    if (!/^01\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: "আপনার ১১ ডিজিটের মোবাইল নাম্বারটির শুরুতে 01 লিখুন" });
    }

    try {
      const newUser = await dbClient.registerUser({
        username, password, fullName, email, mobile, securityQuestion, securityAnswer
      });
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে" });
    }
  });

  app.post("/api/forgot-password", async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: "মোবাইল নাম্বার দিন" });
    
    try {
      const question = await dbClient.checkMobileSecurityQuestion(mobile);
      if (question) {
        res.json({ question });
      } else {
        res.status(404).json({ error: "এই মোবাইল নাম্বারটি আমাদের সিস্টেমে পাওয়া যায়নি।" });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "সার্ভারে সমস্যা হয়েছে।" });
    }
  });

  app.post("/api/verify-security-answer", async (req, res) => {
    const { mobile, answer } = req.body;
    if (!mobile || !answer) return res.status(400).json({ error: "সবগুলো তথ্য দিন" });

    try {
      const user = await dbClient.verifySecurityAnswer(mobile, answer);
      if (user) {
        res.json({ 
          username: user.username, 
          password: user.password,
          message: "আপনার তথ্য নিচে দেওয়া হলো। দয়া করে এটি লিখে রাখুন।" 
        });
      } else {
        res.status(400).json({ error: "ভুল উত্তর! দয়া করে সঠিক উত্তর দিন।" });
      }
    } catch (error) {
      console.error("Verify answer error:", error);
      res.status(500).json({ error: "সার্ভার এরর" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await dbClient.login(username, password);
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
    } catch (error) {
      console.error("Login route error:", error);
      res.status(401).json({ error: "ভুল ইউজারনেম বা পাসওয়ার্ড!" });
    }
  });

  // Jobs Routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await dbClient.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to load jobs" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const newJob = await dbClient.createJob(req.body);
      res.status(201).json(newJob);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const updatedJob = await dbClient.updateJob(id, req.body);
      res.json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await dbClient.deleteJob(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await dbClient.getJobStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching job stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Saved Jobs Routes
  app.get("/api/users/:userId/saved-jobs", async (req, res) => {
    const { userId } = req.params;
    try {
      const list = await dbClient.getSavedJobs(userId);
      res.json(list);
    } catch (error) {
      console.error("Error getting saved jobs:", error);
      res.status(500).json({ error: "Failed to fetch saved jobs" });
    }
  });

  app.post("/api/users/:userId/saved-jobs", async (req, res) => {
    const { userId } = req.params;
    const { jobId } = req.body;
    try {
      await dbClient.saveJob(userId, jobId);
      res.json({ message: "Job saved successfully" });
    } catch (error) {
      console.error("Error saving job:", error);
      res.status(500).json({ error: "Failed to save job" });
    }
  });

  app.delete("/api/users/:userId/saved-jobs/:jobId", async (req, res) => {
    const { userId, jobId } = req.params;
    try {
      await dbClient.unsaveJob(userId, jobId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing saved job:", error);
      res.status(500).json({ error: "Failed to unsave job" });
    }
  });

  // CV Routes
  app.get("/api/cv/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const cv = await dbClient.getCV(userId);
      if (cv) {
        res.json(cv);
      } else {
        res.status(404).json({ error: "CV not found" });
      }
    } catch (error) {
      console.error("Error getting CV:", error);
      res.status(500).json({ error: "Failed to fetch CV" });
    }
  });

  app.post("/api/cv/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      await dbClient.saveCV(userId, req.body);
      res.json({ message: "CV saved successfully" });
    } catch (error) {
      console.error("Error saving CV:", error);
      res.status(500).json({ error: "Failed to save CV" });
    }
  });

  app.get("/api/admin/cv/:userId/download", async (req, res) => {
    const { userId } = req.params;
    try {
      const cv = await dbClient.getCV(userId);
      if (cv) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=cv_${userId}.json`);
        res.send(JSON.stringify(cv));
      } else {
        res.status(404).json({ error: "CV not found" });
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      res.status(500).json({ error: "Failed to fetch CV" });
    }
  });

  // Service Request Routes
  app.post("/api/service-requests", upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
  ]), async (req, res) => {
    const { userId, type, transactionId, paymentMethod } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
    const photoUrl = (files && files['photo']) ? `/uploads/${files['photo'][0].filename}` : null;
    const signatureUrl = (files && files['signature']) ? `/uploads/${files['signature'][0].filename}` : null;

    try {
      const request = await dbClient.createServiceRequest({
        userId, type, photoUrl, signatureUrl, transactionId, paymentMethod
      });
      res.status(201).json(request);
    } catch (error) {
      console.error("Failed to create service request:", error);
      res.status(500).json({ error: "Failed to submit request" });
    }
  });

  app.get("/api/service-requests", async (req, res) => {
    try {
      const requests = await dbClient.getServiceRequests();
      res.json(requests);
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
      res.status(500).json({ error: "Failed to fetch service requests" });
    }
  });

  app.get("/api/my-service-requests/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const requests = await dbClient.getUserServiceRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching user's service requests:", error);
      res.status(500).json({ error: "Failed to fetch your requests" });
    }
  });

  app.put("/api/service-requests/:id", upload.fields([
    { name: 'processedPhoto', maxCount: 1 },
    { name: 'processedSignature', maxCount: 1 }
  ]), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
    try {
      const updates: any = { status };

      if (files && files['processedPhoto']) {
        updates.processedPhotoUrl = `/uploads/${files['processedPhoto'][0].filename}`;
      }
      if (files && files['processedSignature']) {
        updates.processedSignatureUrl = `/uploads/${files['processedSignature'][0].filename}`;
      }

      await dbClient.updateServiceRequest(id, updates);
      res.json({ message: "Request updated successfully" });
    } catch (error) {
      console.error("Error updating service request:", error);
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // Orders Routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await dbClient.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/users/:userId/orders", async (req, res) => {
    const { userId } = req.params;
    try {
      const orders = await dbClient.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    const { id, userId, jobId, selectedPost, amount, jobFee, serviceCharge } = req.body;

    try {
      // 1. Get Job details for educational check
      const job = await dbClient.getJobMinEducationLevel(jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      // 2. Fetch User's CV
      const cvData = await dbClient.getCV(userId);
      
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
        if (!cvData) {
          return res.status(400).json({ 
            error: `দুঃখিত, এই পদে আবেদন করতে হলে আপনার সিভিতে কমপক্ষে "${levelLabels[job.minEducationLevel]}" যুক্ত থাকতে হবে। অনুগ্রহ করে আগে আপনার সিভি তৈরি করুন।` 
          });
        }

        const userEdu = cvData.education || [];
        let userMaxLevel = 0;
        userEdu.forEach((edu: any) => {
          const levelVal = eduMapping[edu.level] || 0;
          if (levelVal > userMaxLevel) {
            userMaxLevel = levelVal;
          }
        });

        if (userMaxLevel < job.minEducationLevel) {
          const users = await dbClient.getUsers();
          const user = users.find((u: any) => u.id === userId);
          return res.status(400).json({ 
            error: `প্রিয় ${user?.fullName || 'ইউজার'}, আপনার সিভিতে এই পদের জন্য প্রয়োজনীয় ন্যূনতম শিক্ষাগত যোগ্যতা ("${levelLabels[job.minEducationLevel]}") যুক্ত করা নেই। যদি আপনার এই শিক্ষাগত যোগ্যতা থাকে, তবে দয়া করে আপনার ড্যাশবোর্ড থেকে সিভি আপডেট করে পুনরায় আবেদনের চেষ্টা করুন।` 
          });
        }
      }

      // Check for duplicate order
      const existingOrder = await dbClient.checkDuplicateOrder(userId, jobId);
      if (existingOrder) {
        const users = await dbClient.getUsers();
        const user = users.find((u: any) => u.id === userId);
        return res.status(400).json({ 
          error: `প্রিয় ${user?.fullName || 'ইউজার'}, আপনি ইতোমধ্যে এই চাকরির উক্ত পদে আবেদনের জন্য অর্ডার করেছেন। অনুগ্রহ করে আপনার ড্যাশবোর্ড চেক করুন অথবা অন্য পদে আবেদনের জন্য অর্ডার করুন` 
        });
      }

      const initialHistory = [{
        status: 'Ordered',
        timestamp: new Date().toISOString(),
        note: 'অর্ডার গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার হয়ে আবেদন শুরু করব।'
      }];
      
      await dbClient.createOrder({
        id, 
        userId, 
        jobId, 
        selectedPost, 
        amount, 
        jobFee, 
        serviceCharge, 
        status: 'Ordered', 
        statusHistory: initialHistory
      });

      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/orders/:orderId/payment", async (req, res) => {
    const { orderId } = req.params;
    const { transactionId, paymentMethod } = req.body;
    try {
      const history = await dbClient.getOrderHistory(orderId);
      history.push({
        status: 'Payment Sent',
        timestamp: new Date().toISOString(),
        note: `পেমেন্ট তথ্য জমাদিন করা হয়েছে (TrxID: ${transactionId}, Method: ${paymentMethod})`
      });

      await dbClient.updateOrderFields(orderId, {
        transactionId, 
        paymentMethod, 
        status: 'Payment Sent', 
        statusHistory: history
      });

      res.json({ message: "Payment info submitted successfully" });
    } catch (error) {
      console.error("Failed to update order payment:", error);
      res.status(500).json({ error: "Failed to update payment info" });
    }
  });

  app.put("/api/orders/:orderId/status", async (req, res) => {
    const { orderId } = req.params;
    const { status, note, demoCopyUrl, finalCopyUrl, adminNote } = req.body;
    try {
      const history = await dbClient.getOrderHistory(orderId);
      
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

      const updates: any = { status, statusHistory: history };

      if (demoCopyUrl !== undefined) {
        updates.demoCopyUrl = demoCopyUrl;
      }
      if (finalCopyUrl !== undefined) {
        updates.finalCopyUrl = finalCopyUrl;
      }
      if (adminNote !== undefined) {
        updates.adminNote = adminNote;
      }

      await dbClient.updateOrderFields(orderId, updates);
      res.json({ message: "Order status updated" });
    } catch (error) {
      console.error("Failed to update order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settingsObj = await dbClient.getSettings();
      res.json(settingsObj);
    } catch (error) {
      console.error("Error loading site settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      await dbClient.updateSettings(req.body);
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      console.error("Error saving site settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Comments & Replies API
  app.get("/api/jobs/:jobId/comments", async (req, res) => {
    const { jobId } = req.params;
    try {
      const comments = await dbClient.getComments(jobId);
      res.json(comments);
    } catch (error) {
      console.error("Error loading comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/jobs/:jobId/comments", async (req, res) => {
    const { jobId } = req.params;
    const { userId, userName, text } = req.body;
    try {
      const newComment = await dbClient.createComment({
        jobId, userId, userName, text
      });
      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  app.post("/api/comments/:commentId/replies", async (req, res) => {
    const { commentId } = req.params;
    const { userId, userName, text, isAdmin } = req.body;
    try {
      const newReply = await dbClient.createReply({
        commentId, userId, userName, text, isAdmin
      });
      res.status(201).json(newReply);
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(500).json({ error: "Failed to add reply" });
    }
  });

  // Contact Messages API
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await dbClient.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error loading contact messages:", error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      const newMsg = await dbClient.createContactMessage({
        name, email, subject, message
      });
      res.status(201).json(newMsg);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.put("/api/contact/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      await dbClient.updateContactMessageStatus(id, status);
      res.json({ message: "Message status updated" });
    } catch (error) {
      console.error("Error updating message status:", error);
      res.status(500).json({ error: "Failed to update message status" });
    }
  });

  app.delete("/api/contact/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await dbClient.deleteContactMessage(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contact message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // Vite middleware for development or Static Assets for Production
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
