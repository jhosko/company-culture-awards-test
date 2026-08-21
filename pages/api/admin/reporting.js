export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!accessToken) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return res.status(500).json({ ok: false, error: "Reporting service unavailable." });
  }

  // Validate the browser's access token with Supabase Auth before exposing any ballot data.
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!userResponse.ok) {
    return res.status(401).json({ ok: false, error: "Your session is invalid or expired." });
  }

  const user = await userResponse.json();

  if (!user?.id || !user?.email) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
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

    return res.status(200).json({
      ok: true,
      admin: { email: user.email },
      ballots
    });
  } catch (error) {
    console.error("Reporting error:", error);
    return res.status(500).json({ ok: false, error: "Could not load reporting data." });
  }
}
