import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { categories, industries, companySizes } from "../lib/data";

const initial = {
  company: "", industry: "", size: "", name: "", email: "",
  score: 85, comment: "", agree: false
};

export default function Vote() {
  const [form, setForm] = useState(initial);
  const [selections, setSelections] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const top = selections[0] || null;
  const extras = selections.slice(1);

  const complete = useMemo(() => {
    let n = 0;
    if (form.company && form.industry && form.size) n++;
    if (form.name && form.email) n++;
    if (selections.length) n++;
    if (form.score) n++;
    if (form.comment.trim()) n++;
    if (form.agree) n++;
    return Math.round((n / 6) * 100);
  }, [form, selections]);

  const canSubmit =
    form.company && form.industry && form.size && form.name && form.email &&
    selections.length && form.comment.trim() && form.agree && !submitting;

  const update = (key, value) => {
    setSubmitError("");
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggle = category => {
    setSubmitError("");
    setSelections(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : prev.length >= 3
        ? prev
        : [...prev, category]
    );
  };

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submit-ballot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.company,
          industry: form.industry,
          company_size: form.size,
          employee_name: form.name,
          work_email: form.email,
          top_category: selections[0] || "",
          second_category: selections[1] || "",
          third_category: selections[2] || "",
          culture_score: form.score,
          employee_comment: form.comment,
          employee_confirmation: form.agree
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result?.error || "We could not submit your ballot. Please try again.");
        return;
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Ballot submit error:", error);
      setSubmitError("We could not submit your ballot. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Layout>
        <section className="section">
          <div className="container narrow">
            <div className="successCard">
              <div className="successMark">✓</div>
              <div className="eyebrow">Thank you</div>
              <h1>Your vote is in.</h1>
              <p>
                Thanks for helping DBusiness recognize the companies building great
                workplace cultures across Metro Detroit.
              </p>
              <button
                className="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm(initial);
                  setSelections([]);
                  setSubmitError("");
                }}
              >
                Submit Another Vote
              </button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pageHero compact">
        <div className="container">
          <div className="eyebrow">Employee ballot</div>
          <h1>Tell us about your workplace.</h1>
          <p>
            It only takes a couple of minutes. Please use your individual company
            email address when submitting your vote.
          </p>
        </div>
      </section>

      <section className="section ballotSection">
        <div className="container ballotLayout">
          <form className="ballot" onSubmit={submit}>
            <div className="progressWrap">
              <div className="progressMeta">
                <span>Ballot progress</span><strong>{complete}%</strong>
              </div>
              <div className="progressTrack">
                <div className="progressBar" style={{ width: `${complete}%` }} />
              </div>
            </div>

            {submitError ? (
              <div style={{
                background: "#fff1f1",
                border: "1px solid #c74343",
                padding: "16px 18px",
                fontWeight: 700
              }}>
                {submitError}
              </div>
            ) : null}

            <BallotSection number="1" title="Your company">
              <div className="field full">
                <label>Company name</label>
                <input
                  value={form.company}
                  onChange={e => update("company", e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="field">
                <label>Industry</label>
                <select value={form.industry} onChange={e => update("industry", e.target.value)}>
                  <option value="">Select industry</option>
                  {industries.map(x => <option key={x}>{x}</option>)}
                </select>
              </div>

              <div className="field">
                <label>Company size</label>
                <select value={form.size} onChange={e => update("size", e.target.value)}>
                  <option value="">Select company size</option>
                  {companySizes.map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
            </BallotSection>

            <BallotSection number="2" title="About you">
              <div className="field">
                <label>Your name</label>
                <input
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  placeholder="First and last name"
                />
              </div>

              <div className="field">
                <label>Company email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="name@company.com"
                />
                <small>
                  Please use your individual company email. Personal email addresses
                  and shared inboxes are not eligible.
                </small>
              </div>
            </BallotSection>

            <BallotSection
              number="3"
              title="What makes your company great?"
              intro="Choose up to three categories. Your first selection is your top choice."
            >
              <div className="categoryGrid full">
                {categories.map(category => {
                  const selected = selections.includes(category);
                  const pos = selections.indexOf(category);

                  return (
                    <button
                      type="button"
                      key={category}
                      className={`categoryCard ${selected ? "selected" : ""}`}
                      onClick={() => toggle(category)}
                    >
                      <span className="categoryState">
                        {pos === 0 ? "Top Choice" : pos > 0 ? "Selected" : "Choose"}
                      </span>
                      <strong>{category}</strong>
                    </button>
                  );
                })}
              </div>

              <div className="selectionSummary full">
                <div>
                  <span>Top choice</span>
                  <strong>{top || "Not selected yet"}</strong>
                </div>
                <div>
                  <span>Additional choices</span>
                  <strong>{extras.length ? extras.join(" • ") : "Optional"}</strong>
                </div>
              </div>
            </BallotSection>

            <BallotSection number="4" title="Overall culture">
              <div className="scoreBlock full">
                <div className="scoreHeader">
                  <div>
                    <label>How would you rate your company culture?</label>
                    <p>Use the scale below to give your overall score.</p>
                  </div>
                  <div className="scoreNumber">{form.score}</div>
                </div>

                <input
                  className="scoreSlider"
                  type="range"
                  min="1"
                  max="100"
                  value={form.score}
                  onChange={e => update("score", Number(e.target.value))}
                />

                <div className="scoreScale"><span>1</span><span>100</span></div>
              </div>

              <div className="field full">
                <label>What do you love most about working here?</label>
                <textarea
                  value={form.comment}
                  onChange={e => update("comment", e.target.value)}
                  placeholder="Tell us what makes your workplace special."
                  rows="6"
                />
                <small>
                  Your response may be used in DBusiness coverage of the Company Culture Awards.
                </small>
              </div>
            </BallotSection>

            <div className="confirmationBox">
              <label className="checkLabel">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={e => update("agree", e.target.checked)}
                />
                <span>
                  I confirm that I currently work for this company and that the information
                  I provided is accurate.
                </span>
              </label>
              <p>Submissions are subject to review to help protect the integrity of the awards.</p>
            </div>

            <button
              className="button buttonLarge submitButton"
              type="submit"
              disabled={!canSubmit}
            >
              {submitting ? "Submitting..." : "Submit My Vote"}
            </button>
          </form>

          <aside className="ballotAside">
            <div className="asideCard navyCard">
              <div className="eyebrow gold">Voting closes</div>
              <div className="bigDate">NOV 10</div>
              <p>Make your voice count before voting closes.</p>
            </div>

            <div className="asideCard">
              <h3>What happens next?</h3>
              <p>
                DBusiness reviews submissions and recognizes standout companies across
                award categories, industries, and company sizes.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function BallotSection({ number, title, intro, children }) {
  return (
    <section className="ballotCard">
      <div className="ballotHeading">
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
          {intro && <p>{intro}</p>}
        </div>
      </div>
      <div className="fieldGrid">{children}</div>
    </section>
  );
}
