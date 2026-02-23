import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { CreateReportSchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// OAuth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Get or create user role
  let userRole = await c.env.DB.prepare(
    "SELECT role FROM user_roles WHERE user_id = ?"
  ).bind(user.id).first();

  if (!userRole) {
    // Create default reporter role for new users
    await c.env.DB.prepare(
      "INSERT INTO user_roles (user_id, role, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))"
    ).bind(user.id, 'reporter').run();
    userRole = { role: 'reporter' };
  }

  return c.json({
    ...user,
    role: userRole.role
  });
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Reports endpoints
app.get("/api/reports", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM reports 
       ORDER BY created_at DESC 
       LIMIT 100`
    ).all();

    const reports = results.map(row => ({
      ...row,
      is_verified: Boolean(row.is_verified),
      media_urls: row.media_urls ? JSON.parse(row.media_urls as string) : null,
    }));

    return c.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return c.json({ error: 'Failed to fetch reports' }, 500);
  }
});

app.post("/api/reports", authMiddleware, zValidator("json", CreateReportSchema), async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'User not authenticated' }, 401);
    }
    const data = c.req.valid("json");

    const { success } = await c.env.DB.prepare(
      `INSERT INTO reports (
        user_id, title, description, hazard_type, severity, 
        latitude, longitude, location_name, media_urls, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(
      user.id,
      data.title,
      data.description || null,
      data.hazard_type,
      data.severity,
      data.latitude,
      data.longitude,
      data.location_name || null,
      data.media_urls || null
    ).run();

    if (!success) {
      return c.json({ error: 'Failed to create report' }, 500);
    }

    return c.json({ success: true }, 201);
  } catch (error) {
    console.error('Error creating report:', error);
    return c.json({ error: 'Failed to create report' }, 500);
  }
});

app.get("/api/reports/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await c.env.DB.prepare(
      "SELECT * FROM reports WHERE id = ?"
    ).bind(id).first();

    if (!result) {
      return c.json({ error: 'Report not found' }, 404);
    }

    const report = {
      ...result,
      is_verified: Boolean(result.is_verified),
      media_urls: result.media_urls ? JSON.parse(result.media_urls as string) : null,
    };

    return c.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return c.json({ error: 'Failed to fetch report' }, 500);
  }
});

// Update report status (for coordinators and admins only)
app.put("/api/reports/:id/status", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    // Check user role
    const userRole = await c.env.DB.prepare(
      "SELECT role FROM user_roles WHERE user_id = ?"
    ).bind(user.id).first();

    if (!userRole || (userRole.role !== 'coordinator' && userRole.role !== 'admin')) {
      return c.json({ error: 'Insufficient permissions' }, 403);
    }

    const id = c.req.param("id");
    const { status, is_verified } = await c.req.json();

    const { success } = await c.env.DB.prepare(
      `UPDATE reports 
       SET status = ?, is_verified = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(status, is_verified ? 1 : 0, id).run();

    if (!success) {
      return c.json({ error: 'Failed to update report' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating report:', error);
    return c.json({ error: 'Failed to update report' }, 500);
  }
});

// Get user role endpoint
app.get("/api/users/:id/role", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    const userId = c.req.param("id");
    
    // Users can only get their own role unless they're admin
    const userRole = await c.env.DB.prepare(
      "SELECT role FROM user_roles WHERE user_id = ?"
    ).bind(user.id).first();

    if (userId !== user.id && (!userRole || userRole.role !== 'admin')) {
      return c.json({ error: 'Insufficient permissions' }, 403);
    }

    const targetUserRole = await c.env.DB.prepare(
      "SELECT * FROM user_roles WHERE user_id = ?"
    ).bind(userId).first();

    if (!targetUserRole) {
      return c.json({ error: 'User role not found' }, 404);
    }

    return c.json(targetUserRole);
  } catch (error) {
    console.error('Error fetching user role:', error);
    return c.json({ error: 'Failed to fetch user role' }, 500);
  }
});

// Update user role (admin only)
app.put("/api/users/:id/role", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    // Check if current user is admin
    const userRole = await c.env.DB.prepare(
      "SELECT role FROM user_roles WHERE user_id = ?"
    ).bind(user.id).first();

    if (!userRole || userRole.role !== 'admin') {
      return c.json({ error: 'Insufficient permissions' }, 403);
    }

    const userId = c.req.param("id");
    const { role } = await c.req.json();

    if (!['reporter', 'coordinator', 'admin'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    const { success } = await c.env.DB.prepare(
      `UPDATE user_roles 
       SET role = ?, updated_at = datetime('now')
       WHERE user_id = ?`
    ).bind(role, userId).run();

    if (!success) {
      return c.json({ error: 'Failed to update user role' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return c.json({ error: 'Failed to update user role' }, 500);
  }
});

export default app;
