async function validateAdmin(req) {
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!accessToken) return { ok: false, status: 401, error: "Unauthorized." };

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 500, error: "Sponsor service unavailable." };
  }

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!userResponse.ok) {
    return { ok: false, status: 401, error: "Your session is invalid or expired." };
  }

  const user = await userResponse.json();

  if (!user?.id || !user?.email) {
    return { ok: false, status: 401, error: "Unauthorized." };
  }

  return { ok: true, user };
}

export default async function handler(req, res) {
  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const auth = await validateAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.error });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json"
  };

  if (req.method === "GET") {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/sponsors?select=*&order=display_order.asc`,
      { headers }
    );

    const sponsors = await response.json();

    if (!response.ok) {
      console.error("Sponsor fetch failed:", sponsors);
      return res.status(500).json({ ok: false, error: "Could not load sponsors." });
    }

    return res.status(200).json({ ok: true, sponsors });
  }

  if (req.method === "POST") {
    const {
      name = "",
      logo_url = "",
      website_url = "",
      sponsor_tier = "Sponsor",
      display_order = 100,
      active = true
    } = req.body || {};

    if (!name.trim() || !logo_url.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Sponsor name and logo URL are required."
      });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/sponsors`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({
        name: name.trim(),
        logo_url: logo_url.trim(),
        website_url: website_url.trim() || null,
        sponsor_tier: sponsor_tier.trim() || "Sponsor",
        display_order: Number(display_order) || 100,
        active: Boolean(active),
        updated_at: new Date().toISOString()
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Sponsor insert failed:", result);
      return res.status(500).json({ ok: false, error: "Could not add sponsor." });
    }

    return res.status(201).json({ ok: true, sponsor: result[0] });
  }

  const { id } = req.body || {};

  if (!id) {
    return res.status(400).json({ ok: false, error: "Sponsor ID is required." });
  }

  if (req.method === "PUT") {
    const {
      name = "",
      logo_url = "",
      website_url = "",
      sponsor_tier = "Sponsor",
      display_order = 100,
      active = true
    } = req.body || {};

    if (!name.trim() || !logo_url.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Sponsor name and logo URL are required."
      });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/sponsors?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({
          name: name.trim(),
          logo_url: logo_url.trim(),
          website_url: website_url.trim() || null,
          sponsor_tier: sponsor_tier.trim() || "Sponsor",
          display_order: Number(display_order) || 100,
          active: Boolean(active),
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      const result = await response.text();
      console.error("Sponsor update failed:", result);
      return res.status(500).json({ ok: false, error: "Could not update sponsor." });
    }

    return res.status(200).json({ ok: true });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/sponsors?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { ...headers, Prefer: "return=minimal" }
    }
  );

  if (!response.ok) {
    const result = await response.text();
    console.error("Sponsor delete failed:", result);
    return res.status(500).json({ ok: false, error: "Could not remove sponsor." });
  }

  return res.status(200).json({ ok: true });
}
