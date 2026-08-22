import { useMemo, useState } from "react";
import Layout from "../components/Layout";

function downloadCsv(rows, filename) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(row =>
      headers.map(header => {
        const value = row[header] ?? "";
        const text = String(value);
        return `"${text.replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [ballots, setBallots] = useState([]);
  const [newsletterSignups, setNewsletterSignups] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifiedBallots = useMemo(
    () => ballots.filter(b => b.verification_status === "verified" && b.review_status !== "excluded"),
    [ballots]
  );

  const uniqueCompanies = useMemo(
    () => new Set(verifiedBallots.map(b => (b.company_name || "").trim().toLowerCase())).size,
    [verifiedBallots]
  );

  async function signIn(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const loginResponse = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            apikey: anonKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        }
      );

      const login = await loginResponse.json();
      if (!loginResponse.ok || !login.access_token) {
        throw new Error("Email or password is incorrect.");
      }

      const [ballotResponse, newsletterResponse] = await Promise.all([
        fetch("/api/admin/reporting", {
          headers: { Authorization: `Bearer ${login.access_token}` }
        }),
        fetch("/api/admin/newsletters", {
          headers: { Authorization: `Bearer ${login.access_token}` }
        })
      ]);

      const ballotResult = await ballotResponse.json();
      const newsletterResult = await newsletterResponse.json();

      if (!ballotResponse.ok) throw new Error(ballotResult?.error || "Could not load ballots.");
      if (!newsletterResponse.ok) throw new Error(newsletterResult?.error || "Could not load newsletter signups.");

      setBallots(ballotResult.ballots || []);
      setNewsletterSignups(newsletterResult.signups || []);
      setAdminEmail(ballotResult.admin?.email || "");
      setAccessToken(login.access_token);
      setPassword("");
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  if (!accessToken) {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <form className="adminLoginBox" onSubmit={signIn}>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="button" disabled={!email || !password || loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
              {error ? <div className="adminError">{error}</div> : null}
            </form>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section">
        <div className="container">
          <h1>Company Culture Awards Reporting</h1>
          <p>Signed in as {adminEmail}</p>

          <div className="adminMetrics">
            <div className="adminMetricCard">
              <span>Total Ballots</span>
              <strong>{ballots.length}</strong>
            </div>
            <div className="adminMetricCard">
              <span>Verified Ballots</span>
              <strong>{verifiedBallots.length}</strong>
            </div>
            <div className="adminMetricCard">
              <span>Unique Companies</span>
              <strong>{uniqueCompanies}</strong>
            </div>
            <div className="adminMetricCard">
              <span>Newsletter Signups</span>
              <strong>{newsletterSignups.length}</strong>
            </div>
          </div>

          <div className="adminActions" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="button"
              onClick={() => downloadCsv(ballots, "company-culture-ballots.csv")}
            >
              Export Ballots CSV
            </button>

            <button
              className="button"
              onClick={() =>
                downloadCsv(newsletterSignups, "company-culture-newsletter-signups.csv")
              }
              disabled={!newsletterSignups.length}
            >
              Export Newsletter Signups
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
