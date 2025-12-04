import { Hono } from "hono";
const authMiddleware = async (c: any, next: any) => {
  c.set("user", { id: "" })
  await next()
}
import { getCookie, setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";

const app = new Hono<{ Bindings: Env }>();

const ADMIN_SESSION_COOKIE_NAME = "admin_session";

// Admin authentication middleware
const adminAuthMiddleware = async (c: any, next: any) => {
  const sessionToken = getCookie(c, ADMIN_SESSION_COOKIE_NAME);
  
  if (!sessionToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const admin = await c.env.DB.prepare(
    "SELECT id, username FROM admin_users WHERE id = ?"
  )
    .bind(sessionToken)
    .first();

  if (!admin) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("admin", admin);
  await next();
};

 

// Member endpoints
app.get("/api/members/me", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const member = await c.env.DB.prepare(
    "SELECT * FROM members WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  return c.json(member || null);
});

app.post("/api/members", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  // Generate unique referral code
  const referralCode = `REF${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const result = await c.env.DB.prepare(
    `INSERT INTO members (user_id, plan, status, referral_code, referred_by, full_name, email, whatsapp, subscription_start_date, subscription_end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, date('now'), date('now', '+1 year'))`
  )
    .bind(
      user.id,
      body.plan,
      "pending",
      referralCode,
      body.referredBy || null,
      body.fullName,
      body.email,
      body.whatsapp
    )
    .run();

  const newMemberId = result.meta.last_row_id;

  // If referred by someone, create referral records and commissions
  if (body.referredBy) {
    const directReferrer = await c.env.DB.prepare(
      "SELECT id, plan FROM members WHERE referral_code = ?"
    )
      .bind(body.referredBy)
      .first();

    if (directReferrer) {
      // Create level 1 referral record
      const level1Result = await c.env.DB.prepare(
        "INSERT INTO referrals (referrer_member_id, referred_member_id, level, status) VALUES (?, ?, 1, 'pending')"
      )
        .bind(directReferrer.id, newMemberId)
        .run();

      // Calculate plan prices
      const planPrices: Record<string, number> = {
        assinante: 997,
        associado: 2497,
        embaixador: 3997,
      };
      const newMemberPrice = planPrices[body.plan] || 0;

      // Create commission for level 1 (10% for both associado and embaixador)
      if (directReferrer.plan === 'associado' || directReferrer.plan === 'embaixador') {
        const level1Commission = newMemberPrice * 0.10;
        await c.env.DB.prepare(
          "INSERT INTO commissions (member_id, referral_id, amount, percentage, status) VALUES (?, ?, ?, 10, 'pending')"
        )
          .bind(directReferrer.id, level1Result.meta.last_row_id, level1Commission)
          .run();
      }

      // For embaixador referrers, create multi-level referrals and commissions
      if (directReferrer.plan === 'embaixador') {
        // Find level 2 referrer (who referred the direct referrer)
        const level2Relation = await c.env.DB.prepare(
          "SELECT referrer_member_id FROM referrals WHERE referred_member_id = ? AND level = 1"
        )
          .bind(directReferrer.id)
          .first();

        if (level2Relation) {
          const level2Referrer = await c.env.DB.prepare(
            "SELECT id, plan FROM members WHERE id = ?"
          )
            .bind(level2Relation.referrer_member_id)
            .first();

          if (level2Referrer && level2Referrer.plan === 'embaixador') {
            // Create level 2 referral record
            const level2Result = await c.env.DB.prepare(
              "INSERT INTO referrals (referrer_member_id, referred_member_id, level, status) VALUES (?, ?, 2, 'pending')"
            )
              .bind(level2Referrer.id, newMemberId)
              .run();

            // Create level 2 commission (5%)
            const level2Commission = newMemberPrice * 0.05;
            await c.env.DB.prepare(
              "INSERT INTO commissions (member_id, referral_id, amount, percentage, status) VALUES (?, ?, ?, 5, 'pending')"
            )
              .bind(level2Referrer.id, level2Result.meta.last_row_id, level2Commission)
              .run();

            // Find level 3 referrer (who referred the level 2 referrer)
            const level3Relation = await c.env.DB.prepare(
              "SELECT referrer_member_id FROM referrals WHERE referred_member_id = ? AND level = 1"
            )
              .bind(level2Referrer.id)
              .first();

            if (level3Relation) {
              const level3Referrer = await c.env.DB.prepare(
                "SELECT id, plan FROM members WHERE id = ?"
              )
                .bind(level3Relation.referrer_member_id)
                .first();

              if (level3Referrer && level3Referrer.plan === 'embaixador') {
                // Create level 3 referral record
                const level3Result = await c.env.DB.prepare(
                  "INSERT INTO referrals (referrer_member_id, referred_member_id, level, status) VALUES (?, ?, 3, 'pending')"
                )
                  .bind(level3Referrer.id, newMemberId)
                  .run();

                // Create level 3 commission (2.5%)
                const level3Commission = newMemberPrice * 0.025;
                await c.env.DB.prepare(
                  "INSERT INTO commissions (member_id, referral_id, amount, percentage, status) VALUES (?, ?, ?, 2.5, 'pending')"
                )
                  .bind(level3Referrer.id, level3Result.meta.last_row_id, level3Commission)
                  .run();
              }
            }
          }
        }
      }
    }
  }

  return c.json({ success: true, referralCode });
});

// Dashboard stats
app.get("/api/dashboard/stats", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const member = await c.env.DB.prepare(
    "SELECT id, plan FROM members WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (!member) {
    return c.json({ error: "Member not found" }, 404);
  }

  // Assinante cannot access stats
  if (member.plan === 'assinante') {
    return c.json({
      directReferrals: 0,
      totalReferrals: 0,
      totalEarned: 0,
      pendingEarnings: 0,
    });
  }

  // Get referral counts
  const directReferrals = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM referrals WHERE referrer_member_id = ? AND level = 1"
  )
    .bind(member.id)
    .first();

  // Only embaixador sees total network
  const maxLevel = member.plan === 'associado' ? 1 : 3;
  const totalReferrals = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM referrals WHERE referrer_member_id = ? AND level <= ?"
  )
    .bind(member.id, maxLevel)
    .first();

  // Get commission stats
  const totalEarned = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE member_id = ? AND status = 'paid'"
  )
    .bind(member.id)
    .first();

  const pendingEarnings = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE member_id = ? AND status = 'pending'"
  )
    .bind(member.id)
    .first();

  return c.json({
    directReferrals: directReferrals?.count || 0,
    totalReferrals: totalReferrals?.count || 0,
    totalEarned: totalEarned?.total || 0,
    pendingEarnings: pendingEarnings?.total || 0,
  });
});

// Get referrals list
app.get("/api/dashboard/referrals", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const member = await c.env.DB.prepare(
    "SELECT id, plan FROM members WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (!member) {
    return c.json({ error: "Member not found" }, 404);
  }

  // Assinante cannot access referrals
  if (member.plan === 'assinante') {
    return c.json([]);
  }

  // Associado sees only level 1 (direct referrals)
  // Embaixador sees levels 1, 2, and 3
  const maxLevel = member.plan === 'associado' ? 1 : 3;

  const { results } = await c.env.DB.prepare(
    `SELECT r.*, m.full_name, m.email, m.plan, m.status, m.created_at as member_created_at
     FROM referrals r
     JOIN members m ON r.referred_member_id = m.id
     WHERE r.referrer_member_id = ? AND r.level <= ?
     ORDER BY r.level ASC, r.created_at DESC`
  )
    .bind(member.id, maxLevel)
    .all();

  return c.json(results);
});

// Get commissions list
app.get("/api/dashboard/commissions", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const member = await c.env.DB.prepare(
    "SELECT id FROM members WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (!member) {
    return c.json({ error: "Member not found" }, 404);
  }

  const { results } = await c.env.DB.prepare(
    `SELECT c.*, m.full_name, m.plan
     FROM commissions c
     JOIN referrals r ON c.referral_id = r.id
     JOIN members m ON r.referred_member_id = m.id
     WHERE c.member_id = ?
     ORDER BY c.created_at DESC`
  )
    .bind(member.id)
    .all();

  return c.json(results);
});

// Admin endpoints
app.post("/api/admin/login", async (c) => {
  const body = await c.req.json();
  
  const admin = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE username = ?"
  )
    .bind(body.username)
    .first();

  if (!admin) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isValidPassword = await bcrypt.compare(body.password, admin.password_hash as string);
  
  if (!isValidPassword) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  setCookie(c, ADMIN_SESSION_COOKIE_NAME, String(admin.id), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return c.json({ success: true });
});

app.get("/api/admin/verify", adminAuthMiddleware, async (c) => {
  return c.json({ authenticated: true });
});

app.post("/api/admin/logout", async (c) => {
  setCookie(c, ADMIN_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true });
});

app.get("/api/admin/stats", async (c) => {
  const totalMembers = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM members"
  ).first();

  const activeMembers = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM members WHERE status = 'active'"
  ).first();

  const pendingMembers = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM members WHERE status = 'pending'"
  ).first();

  const totalSales = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM members"
  ).first();

  const totalCommissionsPaid = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE status = 'paid'"
  ).first();

  const totalCommissionsPending = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE status = 'pending'"
  ).first();

  const pendingWithdrawals = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM withdrawal_requests WHERE status = 'pending'"
  ).first();

  const assinantes = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM members WHERE plan = 'assinante'"
  ).first();

  const associados = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM members WHERE plan = 'associado'"
  ).first();

  const embaixadores = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM members WHERE plan = 'embaixador'"
  ).first();

  return c.json({
    totalMembers: totalMembers?.count || 0,
    activeMembers: activeMembers?.count || 0,
    pendingMembers: pendingMembers?.count || 0,
    totalSales: totalSales?.count || 0,
    totalCommissionsPaid: totalCommissionsPaid?.total || 0,
    totalCommissionsPending: totalCommissionsPending?.total || 0,
    pendingWithdrawals: pendingWithdrawals?.count || 0,
    membersByPlan: {
      assinante: assinantes?.count || 0,
      associado: associados?.count || 0,
      embaixador: embaixadores?.count || 0,
    },
  });
});

app.get("/api/admin/members", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT 
      m.*,
      COUNT(DISTINCT r.id) as total_referrals,
      COALESCE(SUM(com.amount), 0) as total_earned
     FROM members m
     LEFT JOIN referrals r ON m.id = r.referrer_member_id
     LEFT JOIN commissions com ON m.id = com.member_id AND com.status = 'paid'
     GROUP BY m.id
     ORDER BY m.created_at DESC`
  ).all();

  return c.json(results);
});

app.get("/api/admin/commissions", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT 
      c.*,
      m.full_name as member_name,
      m.email as member_email
     FROM commissions c
     JOIN members m ON c.member_id = m.id
     ORDER BY c.created_at DESC`
  ).all();

  return c.json(results);
});

app.get("/api/admin/withdrawals", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT 
      w.*,
      m.full_name as member_name,
      m.email as member_email
     FROM withdrawal_requests w
     JOIN members m ON w.member_id = m.id
     ORDER BY w.requested_at DESC`
  ).all();

  return c.json(results);
});

app.patch("/api/admin/members/:id/status", async (c) => {
  const memberId = c.req.param("id");
  const body = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE members SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(body.status, memberId)
    .run();

  return c.json({ success: true });
});

app.patch("/api/admin/withdrawals/:id/process", async (c) => {
  const withdrawalId = c.req.param("id");
  const body = await c.req.json();
  const newStatus = body.approve ? "approved" : "rejected";

  await c.env.DB.prepare(
    "UPDATE withdrawal_requests SET status = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(newStatus, withdrawalId)
    .run();

  return c.json({ success: true });
});

export default app;
app.post('/api/create-mp-preference', async (c) => {
  const body = await c.req.json()
  const token = c.env.MP_ACCESS_TOKEN
  const site = c.env.SITE_URL
  const payload = {
    items: [
      {
        title: body.item_title,
        unit_price: (() => {
          const v = body.unit_price
          if (typeof v === 'number') return v
          let s = String(v).trim()
          s = s.replace(/[R$\s]/gi, '')
          if (s.includes('.') && s.includes(',')) {
            s = s.replace(/\./g, '').replace(',', '.')
          } else {
            s = s.replace(',', '.')
          }
          const n = parseFloat(s)
          return isNaN(n) ? 0 : n
        })(),
        quantity: 1,
      },
    ],
    external_reference: JSON.stringify({ user_id: body.user_id, organization_id: body.organization_id, plan_type: body.plan_type }),
    payer: { email: body.payer_email },
    back_urls: {
      success: `${site}/payment-success?plan=${body.plan_type}`,
      failure: `${site}/`,
      pending: `${site}/`,
    },
    auto_return: 'approved',
  }
  const resp = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await resp.json()
  return c.json({ init_point: data.init_point }, 200)
})

app.post('/api/webhooks/mercadopago', async (c) => {
  const body = await c.req.json()
  const topic = body.topic || body.type
  const id = body['data']?.id || body['id']
  if (topic !== 'payment' || !id) return c.json({ ok: true })
  const token = c.env.MP_ACCESS_TOKEN
  const payResp = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const pay = await payResp.json()
  if (pay.status === 'approved') {
    let ref
    try { ref = JSON.parse(pay.external_reference) } catch { ref = null }
    if (ref && ref.user_id && ref.organization_id) {
      const supaUrl = c.env.SUPABASE_URL
      const supaKey = c.env.SUPABASE_SERVICE_ROLE_KEY
      await fetch(`${supaUrl}/rest/v1/affiliates?organization_id=eq.${ref.organization_id}&user_id=eq.${ref.user_id}`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ payment_status: 'active' }),
      })
      await fetch(`${supaUrl}/rest/v1/commissions?organization_id=eq.${ref.organization_id}&affiliate_id=eq.${pay.additional_info?.payer?.id || ''}&status=eq.pending`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'available' }),
      })
      await fetch(`${supaUrl}/rest/v1/orders?organization_id=eq.${ref.organization_id}&user_id=eq.${ref.user_id}&status=neq.paid`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'paid' }),
      })
    }
  }
  return c.json({ ok: true })
})
