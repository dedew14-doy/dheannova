import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Supabase Admin Client
  const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("SUPABASE WARNING: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Admin features will not work.");
      return null;
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  };

  const supabaseAdmin = getSupabaseAdmin();

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Admin: User Management Proxy
  app.get("/api/admin/users", async (req, res) => {
    if (!supabaseAdmin) return res.status(503).json({ error: "Supabase Admin client not configured." });
    try {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    if (!supabaseAdmin) return res.status(503).json({ error: "Supabase Admin client not configured." });
    const { email, password, full_name, role } = req.body;
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name, role }
      });
      if (error) throw error;
      
      // Also insert into public.users table (trigger might handle this, but explicit is safer for a prototype)
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert({ id: data.user.id, email, full_name, role });
      
      if (dbError) throw dbError;

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    if (!supabaseAdmin) return res.status(503).json({ error: "Supabase Admin client not configured." });
    const { id } = req.params;
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;
      
      // Also delete from public.users table if it exists
      await supabaseAdmin.from('users').delete().eq('id', id);

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
