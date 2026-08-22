import { useMemo, useState } from "react";
import Layout from "../components/Layout";

const categoryWeight = {
  top_category: 3,
  second_category: 1,
  third_category: 1
};

const blankSponsor = {
  name: "",
  logo_url: "",
  website_url: "",
  sponsor_tier: "Sponsor",
  display_order: 100,
  active: true
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
  const [sponsors, setSponsors] = useState([]);
  const [sponsorDraft, setSponsorDraft] = useState(blankSponsor);
  const [editingSponsorId, setEditingSponsorId] = useState("");
  const [activeView, setActiveView] = useState("reporting");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  async function api(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {})
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result?.error || "Request failed.");
    return result;
  }

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

  async function loadSponsors(token) {
    const response = await fetch("/api/admin/sponsors", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.error || "Could not load sponsors.");
    setSponsors(result.sponsors || []);
  }

  async function signIn(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
        loadContent(result.access_token),
        loadSponsors(result.access_token)
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
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updates = contentItems.map(item => ({
        content_key: item.content_key,
        content_value: contentValues[item.content_key] ?? "",
        content_type: item.content_type
      }));

      await api("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates })
      });

      setMessage("Site content saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveSponsor(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await api("/api/admin/sponsors", {
        method: editingSponsorId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sponsorDraft,
          ...(editingSponsorId ? { id: editingSponsorId } : {})
        })
      });

      await loadSponsors(accessToken);
      setSponsorDraft(blankSponsor);
      setEditingSponsorId("");
      setMessage(editingSponsorId ? "Sponsor updated." : "Sponsor added.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSponsor(id) {
    if (!window.confirm("Remove this sponsor from the CMS?")) return;

    setError("");
    setMessage("");

    try {
      await api("/api/admin/sponsors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      await loadSponsors(accessToken);
      setMessage("Sponsor removed.");
    } catch (err) {
      setError(err.message);
    }
  }

  function editSponsor(sponsor) {
    setEditingSponsorId(sponsor.id);
    setSponsorDraft({
      name: sponsor.name || "",
      logo_url: sponsor.logo_url || "",
      website_url: sponsor.website_url || "",
      sponsor_tier: sponsor.sponsor_tier || "Sponsor",
      display_order: sponsor.display_order || 100,
      active: sponsor.active !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function signOut() {
    setAccessToken("");
    setAdminEmail("");
    setBallots([]);
    setContentItems([]);
    setContentValues({});
    setSponsors([]);
    setPassword("");
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
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
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
            {["reporting", "content", "sponsors"].map(view => (
              <button
                key={view}
                className={activeView === view ? "adminTab active" : "adminTab"}
                onClick={() => {
                  setActiveView(view);
                  setMessage("");
                  setError("");
                }}
              >
                {view === "reporting" ? "Reporting" : view === "content" ? "Site Content" : "Sponsors"}
              </button>
            ))}
          </div>

          {error ? <div className="adminError adminGlobalError">{error}</div> : null}
          {message ? <div className="cmsSuccess">{message}</div> : null}

          {activeView === "content" && (
            <section className="cmsPanel">
              <div className="cmsIntro">
                <div>
                  <div className="eyebrow">CMS</div>
                  <h2>Site Content</h2>
                  <p>Update campaign copy and dates without changing website code.</p>
                </div>
                <button className="button" onClick={saveContent} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="cmsGrid">
                {contentItems.map(item => (
                  <div className="cmsField" key={item.content_key}>
                    <label>{item.label}</label>
                    {item.description ? <small>{item.description}</small> : null}
                    <ContentField
                      item={item}
                      value={contentValues[item.content_key]}
                      onChange={(key, value) =>
                        setContentValues(prev => ({ ...prev, [key]: value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeView === "sponsors" && (
            <section className="cmsPanel">
              <div className="cmsIntro">
                <div>
                  <div className="eyebrow">CMS</div>
                  <h2>Sponsors</h2>
                  <p>Add, remove, reorder, or temporarily hide sponsor logos.</p>
                </div>
              </div>

              <form className="sponsorEditor" onSubmit={saveSponsor}>
                <div className="cmsField">
                  <label>Sponsor name</label>
                  <input
                    value={sponsorDraft.name}
                    onChange={e => setSponsorDraft({...sponsorDraft, name: e.target.value})}
                  />
                </div>

                <div className="cmsField">
                  <label>Logo URL</label>
                  <input
                    type="url"
                    value={sponsorDraft.logo_url}
                    onChange={e => setSponsorDraft({...sponsorDraft, logo_url: e.target.value})}
                  />
                </div>

                <div className="cmsField">
                  <label>Website URL</label>
                  <input
                    type="url"
                    value={sponsorDraft.website_url}
                    onChange={e => setSponsorDraft({...sponsorDraft, website_url: e.target.value})}
                  />
                </div>

                <div className="cmsField">
                  <label>Sponsor tier</label>
                  <input
                    value={sponsorDraft.sponsor_tier}
                    onChange={e => setSponsorDraft({...sponsorDraft, sponsor_tier: e.target.value})}
                  />
                </div>

                <div className="cmsField">
                  <label>Display order</label>
                  <input
                    type="number"
                    value={sponsorDraft.display_order}
                    onChange={e => setSponsorDraft({...sponsorDraft, display_order: Number(e.target.value)})}
                  />
                </div>

                <div className="cmsField sponsorActiveField">
                  <label>
                    <input
                      type="checkbox"
                      checked={sponsorDraft.active}
                      onChange={e => setSponsorDraft({...sponsorDraft, active: e.target.checked})}
                    />
                    Show on website
                  </label>
                </div>

                <div className="sponsorEditorActions">
                  <button className="button" type="submit" disabled={saving}>
                    {editingSponsorId ? "Update Sponsor" : "Add Sponsor"}
                  </button>
                  {editingSponsorId && (
                    <button
                      type="button"
                      className="button sponsorSecondaryButton"
                      onClick={() => {
                        setEditingSponsorId("");
                        setSponsorDraft(blankSponsor);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="sponsorAdminList">
                {sponsors.map(sponsor => (
                  <article className="sponsorAdminCard" key={sponsor.id}>
                    <div className="sponsorAdminLogo">
                      <img src={sponsor.logo_url} alt={sponsor.name} />
                    </div>
                    <div className="sponsorAdminInfo">
                      <strong>{sponsor.name}</strong>
                      <span>{sponsor.sponsor_tier}</span>
                      <span>Order {sponsor.display_order}</span>
                      <span>{sponsor.active ? "Visible" : "Hidden"}</span>
                    </div>
                    <div className="sponsorAdminActions">
                      <button onClick={() => editSponsor(sponsor)}>Edit</button>
                      <button onClick={() => deleteSponsor(sponsor.id)}>Remove</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeView === "reporting" && (
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
                        const sorted = Object.entries(company.category_percentages)
                          .sort((a, b) => b[1] - a[1]);
                        const topCategory = sorted[0];

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

              <section className="adminSection">
                <h2>Ballot Detail</h2>
                <div className="adminTableWrap">
                  <table className="adminTable">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Company</th>
                        <th>Employee</th>
                        <th>Email</th>
                        <th>Industry</th>
                        <th>Size</th>
                        <th>Culture Score</th>
                        <th>Verification</th>
                        <th>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ballots.map(ballot => (
                        <tr key={ballot.id}>
                          <td>{ballot.submitted_at ? new Date(ballot.submitted_at).toLocaleString() : ""}</td>
                          <td>{ballot.company_name}</td>
                          <td>{ballot.employee_name}</td>
                          <td>{ballot.work_email}</td>
                          <td>{ballot.industry}</td>
                          <td>{ballot.company_size}</td>
                          <td>{ballot.culture_score}</td>
                          <td>{ballot.verification_status}</td>
                          <td>{ballot.review_status}</td>
                        </tr>
                      ))}
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
