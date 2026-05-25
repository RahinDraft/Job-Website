import { supabase } from "./supabase.js";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite fallback database
const sqliteDb = new Database(path.join(process.cwd(), "jobs.db"));

// Helper to run query with dynamic fallback and smart array/object merging
async function runQueryWithFallback<T>(
  supabaseOp: () => PromiseLike<any> | Promise<any>,
  sqliteOp: () => T
): Promise<T> {
  let supabaseData: any = null;
  let hasSupabaseError = false;
  try {
    const { data, error } = await supabaseOp();
    if (!error && data !== null) {
      supabaseData = data;
    } else if (error) {
      hasSupabaseError = true;
      console.warn(`⚠️ Supabase query warning (Code: ${error.code || 'unknown'}): ${error.message}.`);
    }
  } catch (err: any) {
    hasSupabaseError = true;
    console.warn(`⚠️ Supabase query exception: ${err?.message || err}.`);
  }

  const sqliteData = sqliteOp();

  if (hasSupabaseError || supabaseData === null) {
    return sqliteData;
  }

  // If both are arrays, let's merge them seamlessly by deduplicating using 'id' or 'key'
  if (Array.isArray(supabaseData) && Array.isArray(sqliteData)) {
    const merged = [...supabaseData];
    for (const sqItem of sqliteData) {
      if (!sqItem) continue;
      const idKey = sqItem.id !== undefined ? 'id' : (sqItem.key !== undefined ? 'key' : null);
      if (idKey) {
        if (!merged.some(sbItem => sbItem && String(sbItem[idKey]) === String(sqItem[idKey]))) {
          merged.push(sqItem);
        }
      } else {
        merged.push(sqItem);
      }
    }
    return merged as unknown as T;
  }

  // If both are settings objects, merge keys (Supabase overrides SQLite)
  if (typeof supabaseData === 'object' && typeof sqliteData === 'object') {
    return { ...sqliteData, ...supabaseData } as T;
  }

  return supabaseData as T;
}

// Helper to run single item query with dynamic fallback
async function runSingleQueryWithFallback<T>(
  supabaseOp: () => PromiseLike<any> | Promise<any>,
  sqliteOp: () => T | null
): Promise<T | null> {
  let supabaseData: any = null;
  let hasSupabaseError = false;
  try {
    const { data, error } = await supabaseOp();
    if (!error && data !== null) {
      supabaseData = data;
    } else if (error && error.code !== 'PGRST116') { // PGRST116 is normal for empty single rows
      hasSupabaseError = true;
      console.warn(`⚠️ Supabase query single warning (Code: ${error.code || 'unknown'}): ${error.message}.`);
    }
  } catch (err: any) {
    hasSupabaseError = true;
    console.warn(`⚠️ Supabase query single exception: ${err?.message || err}.`);
  }

  const sqliteData = sqliteOp();
  if (hasSupabaseError || !supabaseData) {
    return sqliteData;
  }

  return supabaseData as T;
}

// Helper to run write operations with dynamic fallback
async function runWriteWithFallback(
  supabaseOp: () => PromiseLike<any> | Promise<any>,
  sqliteOp: () => void
): Promise<void> {
  try {
    const { error } = await supabaseOp();
    if (!error) {
      // Sync with local SQLite so they both have the data
      try {
        sqliteOp();
      } catch (sqliteErr: any) {
        console.error("SQLite secondary sync error:", sqliteErr?.message || sqliteErr);
      }
      return;
    }
    console.warn(`⚠️ Supabase write warning (Code: ${error.code || 'unknown'}): ${error.message}. Writing only to SQLite.`);
  } catch (err: any) {
    console.warn(`⚠️ Supabase write exception: ${err?.message || err}. Writing only to SQLite.`);
  }
  sqliteOp();
}

export const dbClient = {
  // Settings operations
  async getSettings() {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase.from("site_settings").select("*");
        if (error) return { data: null, error };
        const settingsObj = (data || []).reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        return { data: settingsObj, error: null };
      },
      () => {
        const rows = sqliteDb.prepare("SELECT * FROM site_settings").all() as any[];
        return rows.reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
      }
    );
  },

  async updateSettings(settings: any) {
    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value)
    }));

    await runWriteWithFallback(
      () => supabase.from("site_settings").upsert(upserts),
      () => {
        const stmt = sqliteDb.prepare("INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
        const transaction = sqliteDb.transaction((items) => {
          for (const item of items) {
            stmt.run(item.key, item.value);
          }
        });
        transaction(upserts);
      }
    );
  },

  // Jobs operations
  async getJobs() {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("createdAt", { ascending: false });
        
        if (error) return { data: null, error };

        const formatted = (data || []).map((j: any) => ({
          ...j,
          requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements) : (j.requirements || []),
          positions: typeof j.positions === 'string' ? JSON.parse(j.positions) : (j.positions || []),
          searchKeywords: j.searchKeywords || '',
          seoTitle: j.seoTitle || '',
          seoDescription: j.seoDescription || ''
        }));
        return { data: formatted, error: null };
      },
      () => {
        const rows = sqliteDb.prepare("SELECT * FROM jobs ORDER BY createdAt DESC").all() as any[];
        return rows.map((j: any) => ({
          ...j,
          requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements) : [],
          positions: typeof j.positions === 'string' ? JSON.parse(j.positions) : [],
          searchKeywords: j.searchKeywords || '',
          seoTitle: j.seoTitle || '',
          seoDescription: j.seoDescription || ''
        }));
      }
    );
  },

  async getJobStats() {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase.from("jobs").select("category");
        if (error) return { data: null, error };

        const counts: { [category: string]: number } = {};
        data?.forEach(j => {
          counts[j.category] = (counts[j.category] || 0) + 1;
        });
        const byCategory = Object.entries(counts).map(([category, count]) => ({ category, count }));
        return { data: { total: data?.length || 0, byCategory }, error: null };
      },
      () => {
        const rows = sqliteDb.prepare("SELECT category FROM jobs").all() as any[];
        const counts: { [category: string]: number } = {};
        rows.forEach(j => {
          counts[j.category] = (counts[j.category] || 0) + 1;
        });
        const byCategory = Object.entries(counts).map(([category, count]) => ({ category, count }));
        return { total: rows.length, byCategory };
      }
    );
  },

  async createJob(job: any) {
    const id = job.id || Math.random().toString(36).substr(2, 9);
    const dbJob = {
      id,
      title: job.title ?? null,
      company: job.company ?? null,
      category: job.category ?? null,
      location: job.location ?? null,
      deadline: job.deadline ?? null,
      description: job.description ?? null,
      requirements: JSON.stringify(job.requirements || []),
      salary: job.salary ?? null,
      companyLogoUrl: job.companyLogoUrl ?? null,
      circularImageUrl: job.circularImageUrl ?? null,
      positions: JSON.stringify(job.positions || []),
      applicationFee: job.applicationFee ?? null,
      searchKeywords: job.searchKeywords ?? '',
      seoTitle: job.seoTitle ?? '',
      seoDescription: job.seoDescription ?? '',
      minEducationLevel: Number(job.minEducationLevel || 0)
    };

    await runWriteWithFallback(
      () => supabase.from("jobs").insert(dbJob),
      () => {
        sqliteDb.prepare(`
          INSERT INTO jobs (id, title, company, category, location, deadline, description, requirements, salary, companyLogoUrl, circularImageUrl, positions, applicationFee, searchKeywords, seoTitle, seoDescription, minEducationLevel)
          VALUES (@id, @title, @company, @category, @location, @deadline, @description, @requirements, @salary, @companyLogoUrl, @circularImageUrl, @positions, @applicationFee, @searchKeywords, @seoTitle, @seoDescription, @minEducationLevel)
        `).run(dbJob);
      }
    );

    return { ...job, id };
  },

  async updateJob(id: string, job: any) {
    const dbJob = {
      title: job.title,
      company: job.company,
      category: job.category,
      location: job.location,
      deadline: job.deadline,
      description: job.description,
      requirements: JSON.stringify(job.requirements || []),
      salary: job.salary || null,
      companyLogoUrl: job.companyLogoUrl || null,
      circularImageUrl: job.circularImageUrl || null,
      positions: JSON.stringify(job.positions || []),
      applicationFee: job.applicationFee || null,
      searchKeywords: job.searchKeywords || '',
      seoTitle: job.seoTitle || '',
      seoDescription: job.seoDescription || '',
      minEducationLevel: Number(job.minEducationLevel || 0)
    };

    await runWriteWithFallback(
      () => supabase.from("jobs").update(dbJob).eq("id", id),
      () => {
        sqliteDb.prepare(`
          UPDATE jobs SET 
            title = ?, company = ?, category = ?, location = ?, deadline = ?, description = ?, requirements = ?, salary = ?, 
            companyLogoUrl = ?, circularImageUrl = ?, positions = ?, applicationFee = ?, searchKeywords = ?, seoTitle = ?, seoDescription = ?, minEducationLevel = ?
          WHERE id = ?
        `).run(
          dbJob.title, dbJob.company, dbJob.category, dbJob.location, dbJob.deadline, dbJob.description, dbJob.requirements, dbJob.salary,
          dbJob.companyLogoUrl, dbJob.circularImageUrl, dbJob.positions, dbJob.applicationFee, dbJob.searchKeywords, dbJob.seoTitle, dbJob.seoDescription, dbJob.minEducationLevel,
          id
        );
      }
    );

    return { ...job, id };
  },

  async deleteJob(id: string) {
    await runWriteWithFallback(
      () => supabase.from("jobs").delete().eq("id", id),
      () => {
        sqliteDb.prepare("DELETE FROM jobs WHERE id = ?").run(id);
      }
    );
  },

  // Users & Auth operations
  async getUsers() {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase
          .from("users")
          .select("id, username, password, role, fullName, email, mobile, createdAt, isOnline")
          .order("createdAt", { ascending: false });
        return { data: data || [], error };
      },
      () => {
        return sqliteDb.prepare("SELECT id, username, password, role, fullName, email, mobile, createdAt, isOnline FROM users ORDER BY createdAt DESC").all() as any[];
      }
    );
  },

  async updateUserPassword(id: string, password: string) {
    await runWriteWithFallback(
      () => supabase.from("users").update({ password }).eq("id", id),
      () => {
        sqliteDb.prepare("UPDATE users SET password = ? WHERE id = ?").run(password, id);
      }
    );
  },

  async updateUser(id: string, u: { fullName?: string; mobile?: string; role?: string; password?: string }) {
    await runWriteWithFallback(
      () => supabase.from("users").update(u).eq("id", id),
      () => {
        const fields: string[] = [];
        const values: any[] = [];
        if (u.fullName !== undefined) { fields.push("fullName = ?"); values.push(u.fullName); }
        if (u.mobile !== undefined) { fields.push("mobile = ?"); values.push(u.mobile); }
        if (u.role !== undefined) { fields.push("role = ?"); values.push(u.role); }
        if (u.password !== undefined) { fields.push("password = ?"); values.push(u.password); }
        if (fields.length > 0) {
          values.push(id);
          sqliteDb.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(...values);
        }
      }
    );
  },

  async deleteUser(id: string) {
    await runWriteWithFallback(
      () => supabase.from("users").delete().eq("id", id),
      () => {
        sqliteDb.prepare("DELETE FROM users WHERE id = ?").run(id);
      }
    );
  },

  async getAdminStats(activeVisitors: number, newMessagesCount: number) {
    return runQueryWithFallback(
      async () => {
        const { data: stats } = await supabase.from("site_stats").select("total_visitors").eq("id", 1).single();
        const { count: registeredUsers } = await supabase.from("users").select("*", { count: 'exact', head: true });
        const { count: loggedInUsers } = await supabase.from("users").select("*", { count: 'exact', head: true }).eq("isOnline", 1);
        const { count: newMessagesMsg } = await supabase.from("contact_messages").select("*", { count: 'exact', head: true }).eq("status", "new");

        return {
          data: {
            totalVisitors: stats?.total_visitors || 0,
            activeVisitors,
            registeredUsers: registeredUsers || 0,
            loggedInUsers: loggedInUsers || 0,
            newMessages: newMessagesMsg !== null ? newMessagesMsg : newMessagesCount
          },
          error: null
        };
      },
      () => {
        const stats = sqliteDb.prepare("SELECT total_visitors FROM site_stats WHERE id = 1").get() as any;
        const regUsers = sqliteDb.prepare("SELECT COUNT(*) as count FROM users").get() as any;
        const activeUsers = sqliteDb.prepare("SELECT COUNT(*) as count FROM users WHERE isOnline = 1").get() as any;
        const newMsg = sqliteDb.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'").get() as any;

        return {
          totalVisitors: stats?.total_visitors || 0,
          activeVisitors,
          registeredUsers: regUsers?.count || 0,
          loggedInUsers: activeUsers?.count || 0,
          newMessages: newMsg?.count || 0
        };
      }
    );
  },

  async registerUser(user: any) {
    const id = user.id || Math.random().toString(36).substr(2, 9);
    const dbUser = {
      id,
      username: user.username ?? null,
      password: user.password ?? null,
      role: 'user',
      fullName: user.fullName ?? null,
      email: user.email ?? null,
      mobile: user.mobile ?? null,
      securityQuestion: user.securityQuestion ?? null,
      securityAnswer: user.securityAnswer ?? null,
      isOnline: 0
    };

    // Check pre-existing mobile
    const existing = await runSingleQueryWithFallback(
      async () => {
        const { data, error } = await supabase.from("users").select("id").eq("mobile", user.mobile).maybeSingle();
        return { data, error };
      },
      () => {
        return sqliteDb.prepare("SELECT id FROM users WHERE mobile = ?").get(user.mobile) as any;
      }
    );

    if (existing) {
      throw new Error("এই মোবাইল নাম্বারটি দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে।");
    }

    await runWriteWithFallback(
      () => supabase.from("users").insert(dbUser),
      () => {
        sqliteDb.prepare(`
          INSERT INTO users (id, username, password, role, fullName, email, mobile, securityQuestion, securityAnswer, isOnline)
          VALUES (@id, @username, @password, @role, @fullName, @email, @mobile, @securityQuestion, @securityAnswer, @isOnline)
        `).run(dbUser);
      }
    );

    return { id, username: user.username, role: 'user', fullName: user.fullName, email: user.email, mobile: user.mobile };
  },

  async checkMobileSecurityQuestion(mobile: string) {
    let user = await runSingleQueryWithFallback<any>(
      async () => supabase.from("users").select("securityQuestion").eq("mobile", mobile).maybeSingle(),
      () => sqliteDb.prepare("SELECT securityQuestion FROM users WHERE mobile = ?").get(mobile) as any
    );
    if (!user) {
      try {
        const localUser = sqliteDb.prepare("SELECT securityQuestion FROM users WHERE mobile = ?").get(mobile) as any;
        if (localUser) user = localUser;
      } catch (e) {}
    }
    return user ? user.securityQuestion : null;
  },

  async verifySecurityAnswer(mobile: string, answer: string) {
    let users = await runQueryWithFallback<any[]>(
      async () => supabase.from("users").select("username, password, securityAnswer").eq("mobile", mobile),
      () => sqliteDb.prepare("SELECT username, password, securityAnswer FROM users WHERE mobile = ?").all(mobile) as any[]
    );

    let matchObj = users?.find(u => String(u.securityAnswer).toLowerCase() === answer.toLowerCase());
    if (!matchObj) {
      try {
        const localUsers = sqliteDb.prepare("SELECT username, password, securityAnswer FROM users WHERE mobile = ?").all(mobile) as any[];
        matchObj = localUsers?.find(u => String(u.securityAnswer).toLowerCase() === answer.toLowerCase());
      } catch (e) {}
    }
    return matchObj || null;
  },

  async login(username: string, password: string) {
    let users = await runQueryWithFallback<any[]>(
      async () => supabase.from("users").select("*").eq("password", password),
      () => sqliteDb.prepare("SELECT * FROM users WHERE password = ?").all(password) as any[]
    );

    let user = users?.find(u => String(u.username).toLowerCase() === username.toLowerCase());
    if (!user) {
      try {
        const localUsers = sqliteDb.prepare("SELECT * FROM users WHERE password = ?").all(password) as any[];
        user = localUsers?.find(u => String(u.username).toLowerCase() === username.toLowerCase());
      } catch (e) {}
    }
    return user || null;
  },

  async updateOnlineStatus(userId: string, isOnline: number) {
    await runWriteWithFallback(
      () => supabase.from("users").update({ isOnline }).eq("id", userId),
      () => {
        sqliteDb.prepare("UPDATE users SET isOnline = ? WHERE id = ?").run(isOnline, userId);
      }
    );
  },

  async incrementPageViews() {
    try {
      // Supabase
      const { data: stats } = await supabase.from("site_stats").select("total_visitors").eq("id", 1).single();
      const currentVisitors = stats?.total_visitors || 0;
      await supabase.from("site_stats").update({ total_visitors: currentVisitors + 1 }).eq("id", 1);
    } catch (e) {}

    try {
      // Local SQLite
      sqliteDb.prepare("UPDATE site_stats SET total_visitors = total_visitors + 1 WHERE id = 1").run();
    } catch (e) {}
  },

  // Saved Jobs operations
  async getSavedJobs(userId: string) {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase
          .from("saved_jobs")
          .select(`
            savedAt,
            jobs (*)
          `)
          .eq("userId", userId);

        if (error) return { data: null, error };

        const formatted = (data || [])
          .filter((sj: any) => sj.jobs)
          .map((sj: any) => ({
            ...sj.jobs,
            requirements: typeof sj.jobs.requirements === 'string' ? JSON.parse(sj.jobs.requirements) : (sj.jobs.requirements || []),
            positions: typeof sj.jobs.positions === 'string' ? JSON.parse(sj.jobs.positions) : (sj.jobs.positions || [])
          }));
        return { data: formatted, error: null };
      },
      () => {
        const rows = sqliteDb.prepare(`
          SELECT j.* FROM saved_jobs sj
          JOIN jobs j ON sj.jobId = j.id
          WHERE sj.userId = ?
          ORDER BY sj.savedAt DESC
        `).all(userId) as any[];

        return rows.map((j: any) => ({
          ...j,
          requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements) : [],
          positions: typeof j.positions === 'string' ? JSON.parse(j.positions) : []
        }));
      }
    );
  },

  async saveJob(userId: string, jobId: string) {
    await runWriteWithFallback(
      () => supabase.from("saved_jobs").upsert({ userId, jobId }, { onConflict: "userId,jobId" }),
      () => {
        sqliteDb.prepare("INSERT INTO saved_jobs (userId, jobId) VALUES (?, ?) ON CONFLICT(userId, jobId) DO NOTHING").run(userId, jobId);
      }
    );
  },

  async unsaveJob(userId: string, jobId: string) {
    await runWriteWithFallback(
      () => supabase.from("saved_jobs").delete().eq("userId", userId).eq("jobId", jobId),
      () => {
        sqliteDb.prepare("DELETE FROM saved_jobs WHERE userId = ? AND jobId = ?").run(userId, jobId);
      }
    );
  },

  // CV operations
  async getCV(userId: string) {
    return runSingleQueryWithFallback<any>(
      async () => {
        const { data, error } = await supabase.from("cvs").select("data").eq("userId", userId).maybeSingle();
        if (data) {
          return { data: typeof data.data === 'string' ? JSON.parse(data.data) : data.data, error: null };
        }
        return { data: null, error };
      },
      () => {
        const row = sqliteDb.prepare("SELECT data FROM cvs WHERE userId = ?").get(userId) as any;
        return row ? JSON.parse(row.data) : null;
      }
    );
  },

  async saveCV(userId: string, data: any) {
    const dataStr = JSON.stringify(data);
    await runWriteWithFallback(
      () => supabase.from("cvs").upsert({ userId, data: dataStr }, { onConflict: 'userId' }),
      () => {
        sqliteDb.prepare("INSERT INTO cvs (userId, data) VALUES (?, ?) ON CONFLICT(userId) DO UPDATE SET data = excluded.data").run(userId, dataStr);
      }
    );
  },

  // Service Requests operations
  async createServiceRequest(request: any) {
    const id = request.id || Math.random().toString(36).substr(2, 9);
    const dbReq = {
      id,
      userId: request.userId ?? null,
      type: request.type ?? null,
      photoUrl: request.photoUrl ?? null,
      signatureUrl: request.signatureUrl ?? null,
      transactionId: request.transactionId ?? null,
      paymentMethod: request.paymentMethod ?? null,
      status: 'Pending'
    };

    await runWriteWithFallback(
      () => supabase.from("service_requests").insert(dbReq),
      () => {
        sqliteDb.prepare(`
          INSERT INTO service_requests (id, userId, type, photoUrl, signatureUrl, transactionId, paymentMethod, status)
          VALUES (@id, @userId, @type, @photoUrl, @signatureUrl, @transactionId, @paymentMethod, @status)
        `).run(dbReq);
      }
    );

    return { ...dbReq, id };
  },

  async getServiceRequests() {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase
          .from("service_requests")
          .select(`
            *,
            users(fullName, mobile)
          `)
          .order("createdAt", { ascending: false });

        if (error) return { data: null, error };

        const formatted = (data || []).map((sr: any) => ({
          ...sr,
          fullName: sr.users?.fullName || null,
          mobile: sr.users?.mobile || null
        }));
        return { data: formatted, error: null };
      },
      () => {
        return sqliteDb.prepare(`
          SELECT sr.*, u.fullName, u.mobile 
          FROM service_requests sr
          LEFT JOIN users u ON sr.userId = u.id
          ORDER BY sr.createdAt DESC
        `).all() as any[];
      }
    );
  },

  async getUserServiceRequests(userId: string) {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase
          .from("service_requests")
          .select("*")
          .eq("userId", userId)
          .order("createdAt", { ascending: false });
        return { data: data || [], error };
      },
      () => {
        return sqliteDb.prepare("SELECT * FROM service_requests WHERE userId = ? ORDER BY createdAt DESC").all(userId) as any[];
      }
    );
  },

  async updateServiceRequest(id: string, updates: any) {
    await runWriteWithFallback(
      () => supabase.from("service_requests").update(updates).eq("id", id),
      () => {
        const setQuery = Object.keys(updates).map(k => `${k} = ?`).join(", ");
        const values = Object.values(updates);
        sqliteDb.prepare(`UPDATE service_requests SET ${setQuery} WHERE id = ?`).run(...values, id);
      }
    );
  },

  // Orders operations
  async getOrders() {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            jobs(title, company),
            users(username, fullName, mobile)
          `)
          .order("createdAt", { ascending: false });

        if (error) return { data: null, error };

        const formatted = (data || []).map((o: any) => ({
          ...o,
          jobTitle: o.jobs?.title || "",
          company: o.jobs?.company || "",
          userName: o.users?.fullName || o.users?.username || "",
          userMobile: o.users?.mobile || "",
          statusHistory: o.statusHistory ? JSON.parse(o.statusHistory) : []
        }));
        return { data: formatted, error: null };
      },
      () => {
        const rows = sqliteDb.prepare(`
          SELECT o.*, j.title as jobTitle, j.company, u.username, u.fullName as userName, u.mobile as userMobile
          FROM orders o
          LEFT JOIN jobs j ON o.jobId = j.id
          LEFT JOIN users u ON o.userId = u.id
          ORDER BY o.createdAt DESC
        `).all() as any[];

        return rows.map(o => ({
          ...o,
          statusHistory: o.statusHistory ? JSON.parse(o.statusHistory) : []
        }));
      }
    );
  },

  async getUserOrders(userId: string) {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            jobs(title, company)
          `)
          .eq("userId", userId)
          .order("createdAt", { ascending: false });

        if (error) return { data: null, error };

        const formatted = (data || []).map((o: any) => ({
          ...o,
          jobTitle: o.jobs?.title || "",
          company: o.jobs?.company || "",
          statusHistory: o.statusHistory ? JSON.parse(o.statusHistory) : []
        }));
        return { data: formatted, error: null };
      },
      () => {
        const rows = sqliteDb.prepare(`
          SELECT o.*, j.title as jobTitle, j.company
          FROM orders o
          LEFT JOIN jobs j ON o.jobId = j.id
          WHERE o.userId = ?
          ORDER BY o.createdAt DESC
        `).all(userId) as any[];

        return rows.map(o => ({
          ...o,
          statusHistory: o.statusHistory ? JSON.parse(o.statusHistory) : []
        }));
      }
    );
  },

  async getJobMinEducationLevel(jobId: string) {
    const job = await runSingleQueryWithFallback<any>(
      async () => supabase.from("jobs").select("title, minEducationLevel").eq("id", jobId).single(),
      () => sqliteDb.prepare("SELECT title, minEducationLevel FROM jobs WHERE id = ?").get(jobId) as any
    );
    return job;
  },

  async checkDuplicateOrder(userId: string, jobId: string) {
    const order = await runSingleQueryWithFallback<any>(
      async () => supabase.from("orders").select("id").eq("userId", userId).eq("jobID", jobId).maybeSingle(), // handling lowercase typo safety if any
      () => sqliteDb.prepare("SELECT id FROM orders WHERE userId = ? AND jobId = ?").get(userId, jobId) as any
    );
    return order;
  },

  async createOrder(order: any) {
    const dbOrder = {
      id: order.id,
      userId: order.userId ?? null,
      jobId: order.jobId ?? null,
      selectedPost: order.selectedPost ?? null,
      transactionId: order.transactionId ?? '',
      paymentMethod: order.paymentMethod ?? '',
      amount: order.amount ?? null,
      jobFee: order.jobFee ?? '0',
      serviceCharge: order.serviceCharge ?? '0',
      status: order.status ?? 'Ordered',
      statusHistory: JSON.stringify(order.statusHistory || [])
    };

    await runWriteWithFallback(
      () => supabase.from("orders").insert(dbOrder),
      () => {
        sqliteDb.prepare(`
          INSERT INTO orders (id, userId, jobId, selectedPost, transactionId, paymentMethod, amount, jobFee, serviceCharge, status, statusHistory)
          VALUES (@id, @userId, @jobId, @selectedPost, @transactionId, @paymentMethod, @amount, @jobFee, @serviceCharge, @status, @statusHistory)
        `).run(dbOrder);
      }
    );
  },

  async getOrderHistory(id: string) {
    const order = await runSingleQueryWithFallback<any>(
      async () => supabase.from("orders").select("statusHistory").eq("id", id).single(),
      () => sqliteDb.prepare("SELECT statusHistory FROM orders WHERE id = ?").get(id) as any
    );
    return order ? (order.statusHistory ? JSON.parse(order.statusHistory) : []) : [];
  },

  async updateOrderFields(id: string, updates: any) {
    if (updates.statusHistory && typeof updates.statusHistory !== 'string') {
      updates.statusHistory = JSON.stringify(updates.statusHistory);
    }

    await runWriteWithFallback(
      () => supabase.from("orders").update(updates).eq("id", id),
      () => {
        const setQuery = Object.keys(updates).map(k => `${k} = ?`).join(", ");
        const values = Object.values(updates);
        sqliteDb.prepare(`UPDATE orders SET ${setQuery} WHERE id = ?`).run(...values, id);
      }
    );
  },

  // Comments operations
  async getComments(jobId: string) {
    return runQueryWithFallback(
      async () => {
        const { data: comments, error } = await supabase
          .from("comments")
          .select("*")
          .eq("jobId", jobId)
          .order("createdAt", { ascending: false });

        if (error) return { data: null, error };

        const commentsWithReplies = await Promise.all((comments || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from("replies")
            .select("*")
            .eq("commentId", comment.id)
            .order("createdAt", { ascending: true });

          return {
            ...comment,
            replies: (replies || []).map(r => ({ ...r, isAdmin: Boolean(r.isAdmin) }))
          };
        }));

        return { data: commentsWithReplies, error: null };
      },
      () => {
        const comments = sqliteDb.prepare("SELECT * FROM comments WHERE jobId = ? ORDER BY createdAt DESC").all(jobId) as any[];
        return comments.map(c => {
          const replies = sqliteDb.prepare("SELECT * FROM replies WHERE commentId = ? ORDER BY createdAt ASC").all(c.id) as any[];
          return {
            ...c,
            replies: replies.map(r => ({ ...r, isAdmin: Boolean(r.isAdmin || r.isAdmin === 1) }))
          };
        });
      }
    );
  },

  async createComment(comment: any) {
    const id = comment.id || Math.random().toString(36).substr(2, 9);
    const dbComment = {
      id,
      jobId: comment.jobId ?? null,
      userId: comment.userId ?? null,
      userName: comment.userName ?? null,
      text: comment.text ?? null
    };

    await runWriteWithFallback(
      () => supabase.from("comments").insert(dbComment),
      () => {
        sqliteDb.prepare("INSERT INTO comments (id, jobId, userId, userName, text) VALUES (@id, @jobId, @userId, @userName, @text)").run(dbComment);
      }
    );

    return { ...dbComment, id, createdAt: new Date().toISOString(), replies: [] };
  },

  async createReply(reply: any) {
    const id = reply.id || Math.random().toString(36).substr(2, 9);
    const dbReply = {
      id,
      commentId: reply.commentId ?? null,
      userId: reply.userId ?? null,
      userName: reply.userName ?? null,
      text: reply.text ?? null,
      isAdmin: reply.isAdmin ? 1 : 0
    };

    await runWriteWithFallback(
      () => supabase.from("replies").insert(dbReply),
      () => {
        sqliteDb.prepare("INSERT INTO replies (id, commentId, userId, userName, text, isAdmin) VALUES (@id, @commentId, @userId, @userName, @text, @isAdmin)").run(dbReply);
      }
    );

    return { ...dbReply, id, isAdmin: Boolean(reply.isAdmin), createdAt: new Date().toISOString() };
  },

  // Contact messages operations
  async getContactMessages() {
    return runQueryWithFallback(
      async () => {
        const { data, error } = await supabase.from("contact_messages").select("*").order("createdAt", { ascending: false });
        return { data: data || [], error };
      },
      () => {
        return sqliteDb.prepare("SELECT * FROM contact_messages ORDER BY createdAt DESC").all() as any[];
      }
    );
  },

  async createContactMessage(msg: any) {
    const id = msg.id || Math.random().toString(36).substr(2, 9);
    const dbMsg = {
      id,
      name: msg.name ?? null,
      email: msg.email ?? null,
      subject: msg.subject ?? null,
      message: msg.message ?? null,
      status: 'new'
    };

    await runWriteWithFallback(
      () => supabase.from("contact_messages").insert(dbMsg),
      () => {
        sqliteDb.prepare("INSERT INTO contact_messages (id, name, email, subject, message, status) VALUES (@id, @name, @email, @subject, @message, @status)").run(dbMsg);
      }
    );

    return { ...dbMsg, id, createdAt: new Date().toISOString() };
  },

  async updateContactMessageStatus(id: string, status: string) {
    await runWriteWithFallback(
      () => supabase.from("contact_messages").update({ status }).eq("id", id),
      () => {
         sqliteDb.prepare("UPDATE contact_messages SET status = ? WHERE id = ?").run(status, id);
      }
    );
  },

  async deleteContactMessage(id: string) {
    await runWriteWithFallback(
      () => supabase.from("contact_messages").delete().eq("id", id),
      () => {
        sqliteDb.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
      }
    );
  }
};

// Seed admin user in Supabase in background on load
const seedSupabaseAdmin = async () => {
  try {
    const { data, error } = await supabase.from("users").select("id").eq("username", "admin").maybeSingle();
    if (!error && !data) {
      // Insert default admin
      await supabase.from("users").insert({
        id: "admin-id-1234",
        username: "admin",
        password: "admin123",
        role: "admin",
        fullName: "System Admin",
        mobile: "01700000000"
      });
      console.log("✅ Admin user seeded successfully into Supabase users table.");
    }
  } catch (err) {
    console.warn("⚠️ Could not seed admin user in Supabase:", err);
  }
};
seedSupabaseAdmin().catch(console.error);
