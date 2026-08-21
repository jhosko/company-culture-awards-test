export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const adminKey = req.headers["x-admin-key"];
  const expectedKey = process.env.ADMIN_REPORTING_KEY;

  if (!expectedKey || !adminKey || adminKey !== expectedKey) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ ok: false, error: "Reporting service unavailable." });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/ballots?select=*&order=submitted_at.desc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`
        }
      }
    );

    const ballots = await response.json();

    if (!response.ok) {
      console.error("Reporting fetch failed:", ballots);
      return res.status(500).json({ ok: false, error: "Could not load reporting data." });
    }

    return res.status(200).json({ ok: true, ballots });
  } catch (error) {
    console.error("Reporting error:", error);
    return res.status(500).json({ ok: false, error: "Could not load reporting data." });
  }
}
