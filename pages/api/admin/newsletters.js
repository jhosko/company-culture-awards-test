export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!accessToken) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!userResponse.ok) {
    return res.status(401).json({ ok: false, error: "Your session is invalid or expired." });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/newsletter_signups?select=employee_name,work_email,hour_today,a_list,hour_exclusives,dbusiness_daily,submitted_at&order=submitted_at.desc`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`
      }
    }
  );

  const signups = await response.json();

  if (!response.ok) {
    return res.status(500).json({
      ok: false,
      error: "Could not load newsletter signups."
    });
  }

  return res.status(200).json({ ok: true, signups });
}
