async function validateAdmin(req) {
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!accessToken) return { ok: false, status: 401, error: "Unauthorized." };

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 500, error: "CMS service unavailable." };
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
  if (!["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const auth = await validateAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.error });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ ok: false, error: "CMS service unavailable." });
  }

  if (req.method === "GET") {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/site_content?select=*&order=label.asc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`
        }
      }
    );

    const content = await response.json();

    if (!response.ok) {
      console.error("CMS fetch failed:", content);
      return res.status(500).json({ ok: false, error: "Could not load site content." });
    }

    return res.status(200).json({
      ok: true,
      admin: { email: auth.user.email },
      content
    });
  }

  const { updates } = req.body || {};
  if (!Array.isArray(updates) || !updates.length) {
    return res.status(400).json({ ok: false, error: "No content updates were provided." });
  }

  const allowedTypes = new Set(["text", "textarea", "url", "date", "status"]);

  for (const item of updates) {
    const contentKey = typeof item.content_key === "string" ? item.content_key.trim() : "";
    const contentValue = typeof item.content_value === "string" ? item.content_value.trim() : "";
    const contentType = typeof item.content_type === "string" ? item.content_type.trim() : "";

    if (!contentKey || !allowedTypes.has(contentType)) {
      return res.status(400).json({ ok: false, error: "Invalid content update." });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/site_content?content_key=eq.${encodeURIComponent(contentKey)}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          content_value: contentValue,
          updated_at: new Date().toISOString(),
          updated_by: auth.user.id
        })
      }
    );

    if (!response.ok) {
      const result = await response.text();
      console.error("CMS update failed:", contentKey, result);
      return res.status(500).json({ ok: false, error: `Could not update ${contentKey}.` });
    }
  }

  return res.status(200).json({
    ok: true,
    message: "Site content updated successfully."
  });
}
