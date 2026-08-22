import { useMemo, useState } from "react";
import Layout from "../components/Layout";

const categoryWeight = {
  top_category: 3,
  second_category: 1,
  third_category: 1
};

function calculateCompanySummary(ballots) {
  const map = new Map();

  for (const ballot of ballots) {
    if (ballot.verification_status !== "verified") continue;
    if (ballot.review_status === "excluded") continue;

    const key = (ballot.company_name || "").trim().toLowerCase();
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, {
        company_name: ballot.company_name,
        industry: ballot.industry,
        company_size: ballot.company_size,
        ballots: 0,
        score_sum: 0,
        category_points: {}
      });
    }

    const company = map.get(key);
    company.ballots += 1;
    company.score_sum += Number(ballot.culture_score || 0);

    for (const field of ["top_category", "second_category", "third_category"]) {
      const category = ballot[field];
      if (!category) continue;
      company.category_points[category] =
        (company.category_points[category] || 0) + categoryWeight[field];
    }
  }

  return Array.from(map.values()).map(company => {
    const possiblePoints = company.ballots * 5;
    const category_percentages = {};

    for (const [category, points] of Object.entries(company.category_points)) {
      category_percentages[category] = possiblePoints
        ? Math.round((points / possiblePoints) * 1000) / 10
        : 0;
    }

    return {
      ...company,
      average_culture_score: company.ballots
        ? Math.round((company.score_sum / company.ballots) * 10) / 10
        : 0,
      possible_category_points: possiblePoints,
      category_percentages
    };
  });
}

function downloadCsv(rows) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(row =>
      headers.map(header => {
        const value = row[header] ?? "";
        const text = typeof value === "object" ? JSON.stringify(value) : String(value);
        return `"${text.replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "company-culture-ballots.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function ContentField({ item, value, onChange }) {
  const common = {
    value: value ?? "",
    onChange: e => onChange(item.content_key, e.target.value)
  };

  if (item.content_type === "textarea") {
    return <textarea {...common} rows="5" />;
  }

  if (item.content_type === "status") {
    return (
      <select {...common}>
        <option value="voting_open">Voting Open</option>
        <option value="voting_closed">Voting Closed</option>
        <option value="tickets_on_sale">Tickets On Sale</option>
        <option value="winners_announced">Winners Announced</option>
      </select>
    );
  }

  return (
    <input
      {...common}
      type={
        item.content_type === "date"
          ? "date"
          : item.content_type === "url"
          ? "url"
          : "text"
      }
    />
  );
}

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [ballots, setBallots] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [contentValues, setContentValues] = useState({});
  const [activeView, setActiveView] = useState("reporting");
  const [error, setError] = useState("");
  const [cmsMessage, setCmsMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  const verifiedBallots = useMemo(
    () => ballots.filter(b => b.verification_status === "verified" && b.review_status !== "excluded"),
    [ballots]
  );

  const companies = useMemo(
    () => calculateCompanySummary(ballots).sort((a, b) => b.ballots - a.ballots),
    [ballots]
  );

  const industries = useMemo(
    () => [...new Set(verifiedBallots.map(b => b.industry).filter(Boolean))],
    [verifiedBallots]
  );

  async function loadReporting(token) {
    const response = await fetch("/api/admin/reporting", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result?.error || "Could not load reporting.");

    setBallots(result.ballots || []);
    setAdminEmail(result.admin?.email || "");
  }

  async function loadContent(token) {
    const response = await fetch("/api/admin/content", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result?.error || "Could not load site content.");

    const items = result.content || [];
    setContentItems(items);

    const values = {};
    items.forEach(item => {
      values[item.content_key] = item.content_value || "";
    });
    setContentValues(values);
  }

  async function signIn(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !anonKey) throw new Error("Admin login is not configured.");

      const response = await fetch(
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

      const result = await response.json();

      if (!response.ok || !result.access_token) {
        throw new Error("Email or password is incorrect.");
      }

      await Promise.all([
        loadReporting(result.access_token),
        loadContent(result.access_token)
      ]);

      setAccessToken(result.access_token);
      setPassword("");
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function saveContent() {
    setSavingContent(true);
    setCmsMessage("");
    setError("");

    try {
      const updates = contentItems.map(item => ({
        content_key: item.content_key,
        content_value: contentValues[item.content_key] ?? "",
        content_type: item.content_type
      }));

      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ updates })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Could not save site content.");

      setCmsMessage("Saved. The homepage is now using the updated CMS values.");
      await loadContent(accessToken);
    } catch (err) {
      setError(err.message || "Could not save site content.");
    } finally {
      setSavingContent(false);
    }
  }

  function updateContentValue(key, value) {
    setCmsMessage("");
    setContentValues(prev => ({ ...prev, [key]: value }));
  }

  function signOut() {
    setAccessToken("");
    setAdminEmail("");
    setBallots([]);
    setContentItems([]);
    setContentValues({});
    setPassword("");
    setError("");
    setCmsMessage("");
  }

  if (!accessToken) {
    return (
      <Layout>
        <section className="pageHero compact">
          <div className="container">
            <div className="eyebrow">Internal Administration</div>
            <h1>Company Culture Awards Admin</h1>
            <p>Authorized DBusiness users only.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <form className="adminLoginBox" onSubmit={signIn}>
              <label>Email</label>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@hour-media.com"
              />

              <label>Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
              />

              <button className="button" type="submit" disabled={!email || !password || loading}>
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
      <section className="pageHero compact adminHeader">
        <div className="container">
          <div>
            <div className="eyebrow">Internal Administration</div>
            <h1>Company Culture Awards Admin</h1>
            <p>Signed in as {adminEmail}</p>
          </div>
          <button className="button" onClick={signOut}>Sign Out</button>
        </div>
      </section>

      <section className="section adminWorkspace">
        <div className="container">
          <div className="adminTabs">
            <button
              className={activeView === "reporting" ? "adminTab active" : "adminTab"}
              onClick={() => setActiveView("reporting")}
            >
              Reporting
            </button>
            <button
              className={activeView === "content" ? "adminTab active" : "adminTab"}
              onClick={() => setActiveView("content")}
            >
              Site Content
            </button>
          </div>

          {error ? <div className="adminError adminGlobalError">{error}</div> : null}

          {activeView === "content" ? (
            <section className="cmsPanel">
              <div className="cmsIntro">
                <div>
                  <div className="eyebrow">CMS</div>
                  <h2>Site Content</h2>
                  <p>
                    Update campaign copy and dates without changing the website code.
                    The design and page structure remain protected.
                  </p>
                </div>
                <button className="button" onClick={saveContent} disabled={savingContent}>
                  {savingContent ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {cmsMessage ? <div className="cmsSuccess">{cmsMessage}</div> : null}

              <div className="cmsGrid">
                {contentItems.map(item => (
                  <div className="cmsField" key={item.content_key}>
                    <label>{item.label}</label>
                    {item.description ? <small>{item.description}</small> : null}
                    <ContentField
                      item={item}
                      value={contentValues[item.content_key]}
                      onChange={updateContentValue}
                    />
                    <div className="cmsKey">{item.content_key}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <>
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
                  <strong>{companies.length}</strong>
                </div>
                <div className="adminMetricCard">
                  <span>Industries</span>
                  <strong>{industries.length}</strong>
                </div>
              </div>

              <div className="adminActions">
                <button className="button" onClick={() => downloadCsv(ballots)}>
                  Export Raw Ballots CSV
                </button>
              </div>

              <section className="adminSection">
                <h2>Company Summary</h2>
                <div className="adminTableWrap">
                  <table className="adminTable">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Industry</th>
                        <th>Size</th>
                        <th>Verified Ballots</th>
                        <th>Avg Culture Score</th>
                        <th>Top Category</th>
                        <th>Top Category %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map(company => {
                        const sortedCategories = Object.entries(company.category_percentages)
                          .sort((a, b) => b[1] - a[1]);
                        const topCategory = sortedCategories[0];

                        return (
                          <tr key={company.company_name}>
                            <td>{company.company_name}</td>
                            <td>{company.industry}</td>
                            <td>{company.company_size}</td>
                            <td>{company.ballots}</td>
                            <td>{company.average_culture_score}</td>
                            <td>{topCategory ? topCategory[0] : "—"}</td>
                            <td>{topCategory ? `${topCategory[1]}%` : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
