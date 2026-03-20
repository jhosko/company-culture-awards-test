import { useMemo, useState } from "react";

const categories = [
  "Best Leadership",
  "Career Growth",
  "Compensation and Benefits",
  "Work Life Balance",
  "Team Environment",
  "Innovation and New Ideas",
  "Employee Recognition",
  "Communication and Transparency",
  "Workplace Flexibility",
  "Workplace Amenities",
  "Company Pride and Purpose",
];

const sizeOptions = [
  "Small (1 to 49 employees)",
  "Medium (50 to 249 employees)",
  "Large (250 to 999 employees)",
  "Enterprise (1,000 or more employees)",
];

const industryOptions = [
  "Automotive and Mobility",
  "Construction and Engineering",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Nonprofit",
  "Professional Services",
  "Real Estate and Development",
  "Technology",
  "Retail and Hospitality",
  "Media, Marketing, and Creative Services",
  "Other",
];

function SectionCard({ children, dark = false }) {
  return (
    <div
      style={{
        background: dark ? "#111111" : "#ffffff",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
        borderRadius: 26,
        boxShadow: dark
          ? "0 16px 40px rgba(0,0,0,0.28)"
          : "0 12px 32px rgba(15,23,42,0.08)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 800,
        marginBottom: 8,
        color: "#111827",
        letterSpacing: 0.2,
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "15px 16px",
        borderRadius: 16,
        border: "2px solid #e5e7eb",
        outline: "none",
        fontSize: 16,
        boxSizing: "border-box",
        background: "#fff",
        transition: "all 0.2s ease",
        ...(props.style || {}),
      }}
    />
  );
}

function SelectInput(props) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "15px 16px",
        borderRadius: 16,
        border: "2px solid #e5e7eb",
        outline: "none",
        fontSize: 16,
        background: "#fff",
        boxSizing: "border-box",
        transition: "all 0.2s ease",
        ...(props.style || {}),
      }}
    />
  );
}

function TextAreaInput(props) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        padding: "15px 16px",
        borderRadius: 16,
        border: "2px solid #e5e7eb",
        outline: "none",
        fontSize: 16,
        minHeight: 150,
        boxSizing: "border-box",
        resize: "vertical",
        background: "#fff",
        transition: "all 0.2s ease",
        ...(props.style || {}),
      }}
    />
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "8px 12px",
        borderRadius: 999,
        background: light ? "rgba(255,255,255,0.08)" : "#fef2f2",
        color: light ? "#fca5a5" : "#b91c1c",
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("vote");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [extraCategories, setExtraCategories] = useState([]);
  const [score, setScore] = useState(86);
  const [comment, setComment] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allSelectedCategories = useMemo(() => {
    return [primaryCategory, ...extraCategories].filter(Boolean);
  }, [primaryCategory, extraCategories]);

  const completion = useMemo(() => {
    let steps = 0;
    if (companyName && industry && companySize) steps += 1;
    if (fullName && email) steps += 1;
    if (primaryCategory) steps += 1;
    if (score) steps += 1;
    if (comment) steps += 1;
    if (agreed) steps += 1;
    return Math.round((steps / 6) * 100);
  }, [companyName, industry, companySize, fullName, email, primaryCategory, score, comment, agreed]);

  const canSubmit =
    companyName &&
    industry &&
    companySize &&
    fullName &&
    email &&
    primaryCategory &&
    comment &&
    agreed;

  function toggleExtraCategory(category) {
    const isSelected = extraCategories.includes(category);

    if (isSelected) {
      setExtraCategories(extraCategories.filter((item) => item !== category));
      return;
    }

    if (extraCategories.length >= 2) return;

    setExtraCategories([...extraCategories, category]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const tabButtonStyle = (isActive) => ({
    flex: 1,
    padding: "14px 18px",
    borderRadius: 16,
    border: isActive ? "2px solid #b91c1c" : "2px solid transparent",
    background: isActive ? "#ffffff" : "#f3f4f6",
    color: "#111827",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 15,
    boxShadow: isActive ? "0 8px 18px rgba(0,0,0,0.06)" : "none",
  });

  const stepTitleStyle = {
    color: "#111827",
    fontWeight: 900,
    marginBottom: 14,
    fontSize: 22,
    letterSpacing: -0.3,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(circle at top left, rgba(185,28,28,0.12), transparent 30%), linear-gradient(135deg, #f7f7f7 0%, #ffffff 46%, #f8fafc 100%)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "24px 24px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 22,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 900, color: "#b91c1c", letterSpacing: 0.2 }}>
              DBusiness
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>
              Metro Detroit workplace recognition program
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 24px 72px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 40,
              alignItems: "center",
            }}
            className="hero-grid"
          >
            <div>
              <Eyebrow>Do you love where you work?</Eyebrow>

              <h1
                style={{
                  fontSize: 68,
                  lineHeight: 0.94,
                  margin: "0 0 18px",
                  fontWeight: 900,
                  letterSpacing: -2,
                  maxWidth: 760,
                }}
              >
                COMPANY <span style={{ color: "#dc2626" }}>CULTURE</span> AWARDS
              </h1>

              <p
                style={{
                  fontSize: 21,
                  lineHeight: 1.65,
                  color: "#4b5563",
                  maxWidth: 760,
                  marginBottom: 30,
                }}
              >
                Recognizing companies across Metro Detroit with standout workplace cultures,
                based on direct employee feedback across leadership, growth, flexibility,
                recognition, communication, and overall experience.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
                <button
                  onClick={() => setActiveTab("vote")}
                  style={{
                    background: "#111111",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 18,
                    padding: "16px 24px",
                    fontSize: 16,
                    fontWeight: 900,
                    cursor: "pointer",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
                  }}
                >
                  Vote now
                </button>

                <button
                  onClick={() => setActiveTab("methodology")}
                  style={{
                    background: "#ffffff",
                    color: "#111111",
                    border: "2px solid #d1d5db",
                    borderRadius: 18,
                    padding: "14px 22px",
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  View methodology
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                }}
                className="hero-stats"
              >
                {[
                  ["Employee driven", "Built around real workplace feedback"],
                  ["Simple to complete", "Designed for fast participation"],
                  ["Credible results", "Reviewed for authenticity and quality"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 20,
                      padding: 18,
                      boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
                    <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.55 }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <SectionCard dark>
              <div style={{ padding: 30, color: "#fff" }}>
                <Eyebrow light>Awards overview</Eyebrow>
                <h2 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900 }}>
                  How recognition is earned
                </h2>
                <p
                  style={{
                    margin: "0 0 22px",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  Employees identify where their company stands out most, score overall culture,
                  and provide a written comment that helps shape editorial review and winner
                  consideration.
                </p>

                {[
                  {
                    title: "1. Employees vote",
                    text: "Workers nominate their company, select a primary category, add up to two more, score culture, and leave a short comment.",
                  },
                  {
                    title: "2. Submissions are reviewed",
                    text: "Entries may be checked for authenticity, duplication, domain alignment, and other quality signals.",
                  },
                  {
                    title: "3. Winners are recognized",
                    text: "Top companies are evaluated across categories, industry groupings, and company size segments.",
                  },
                ].map((step) => (
                  <div
                    key={step.title}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: 18,
                      borderRadius: 20,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.04)",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        minWidth: 42,
                        borderRadius: 14,
                        background: "rgba(220,38,38,0.16)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fca5a5",
                        fontWeight: 900,
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>{step.title}</div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.72)",
                          fontSize: 15,
                          lineHeight: 1.6,
                        }}
                      >
                        {step.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <div style={{ background: "#111111", color: "#fff" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}
          className="trust-grid"
        >
          {[
            "Recognition shaped by employee input",
            "Industry and company size considered",
            "Up to three culture strengths per ballot",
            "Editorially positioned for publication and event recognition",
          ].map((item) => (
            <div
              key={item}
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "42px 24px 70px" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            maxWidth: 760,
            background: "#e5e7eb",
            padding: 8,
            borderRadius: 20,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <button style={tabButtonStyle(activeTab === "vote")} onClick={() => setActiveTab("vote")}>
            Voting experience
          </button>
          <button
            style={tabButtonStyle(activeTab === "methodology")}
            onClick={() => setActiveTab("methodology")}
          >
            Methodology
          </button>
          <button
            style={tabButtonStyle(activeTab === "timeline")}
            onClick={() => setActiveTab("timeline")}
          >
            Timeline
          </button>
        </div>

        {activeTab === "vote" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 28,
              alignItems: "start",
            }}
            className="vote-grid"
          >
            <SectionCard>
              <form onSubmit={handleSubmit}>
                <div style={{ padding: 32 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20,
                      marginBottom: 30,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <Eyebrow>Ballot</Eyebrow>
                      <h2 style={{ margin: 0, fontSize: 38, fontWeight: 900, letterSpacing: -1 }}>
                        Employee Voting Form
                      </h2>
                      <p
                        style={{
                          margin: "10px 0 0",
                          color: "#6b7280",
                          fontSize: 16,
                          lineHeight: 1.65,
                          maxWidth: 640,
                        }}
                      >
                        Select one primary culture strength, add up to two supporting categories,
                        assign an overall culture score, and explain what makes your workplace stand
                        out.
                      </p>
                    </div>

                    <div style={{ minWidth: 160 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          marginBottom: 8,
                          textAlign: "right",
                          textTransform: "uppercase",
                          color: "#6b7280",
                        }}
                      >
                        {completion}% complete
                      </div>
                      <div
                        style={{
                          height: 10,
                          background: "#e5e7eb",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${completion}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #b91c1c, #ef4444)",
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {submitted && (
                    <div
                      style={{
                        padding: 20,
                        borderRadius: 20,
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        marginBottom: 30,
                      }}
                    >
                      <div style={{ fontWeight: 900, marginBottom: 8, fontSize: 18 }}>
                        Ballot submitted successfully
                      </div>
                      <div style={{ color: "#065f46", lineHeight: 1.65, fontSize: 15 }}>
                        Thank you for participating. Your submission has been received and may be
                        reviewed as part of the final awards evaluation process.
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: 36 }}>
                    <div style={stepTitleStyle}>1. Tell us where you work</div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 16,
                      }}
                      className="field-grid"
                    >
                      <div style={{ gridColumn: "1 / -1" }}>
                        <FieldLabel>Company name</FieldLabel>
                        <TextInput
                          placeholder="Enter your company name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>

                      <div>
                        <FieldLabel>Industry</FieldLabel>
                        <SelectInput value={industry} onChange={(e) => setIndustry(e.target.value)}>
                          <option value="">Select industry</option>
                          {industryOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </SelectInput>
                      </div>

                      <div>
                        <FieldLabel>Company size</FieldLabel>
                        <SelectInput
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                        >
                          <option value="">Select size</option>
                          {sizeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </SelectInput>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e5e7eb",
                          borderRadius: 18,
                          padding: 16,
                          color: "#6b7280",
                          fontSize: 14,
                          lineHeight: 1.6,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Choose the industry and size that best reflect your company today.
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 36 }}>
                    <div style={stepTitleStyle}>2. Verify your connection</div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                      }}
                      className="two-grid"
                    >
                      <div>
                        <FieldLabel>Full name</FieldLabel>
                        <TextInput
                          placeholder="Your name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>

                      <div>
                        <FieldLabel>Work email</FieldLabel>
                        <TextInput
                          type="email"
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            marginTop: 8,
                            lineHeight: 1.55,
                          }}
                        >
                          Please use your company domain email. Personal addresses should not be
                          used.
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 14,
                        color: "#6b7280",
                        lineHeight: 1.6,
                      }}
                    >
                      Submissions may be reviewed for domain match, duplication, suspicious
                      activity, and general quality assurance.
                    </div>
                  </div>

                  <div style={{ marginBottom: 36 }}>
                    <div style={stepTitleStyle}>3. Choose up to 3 culture categories</div>

                    <div style={{ marginBottom: 18 }}>
                      <FieldLabel>Primary category</FieldLabel>
                      <SelectInput
                        value={primaryCategory}
                        onChange={(e) => setPrimaryCategory(e.target.value)}
                      >
                        <option value="">Select the area where your company stands out most</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </SelectInput>
                    </div>

                    <div>
                      <FieldLabel>Additional categories</FieldLabel>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          marginBottom: 10,
                          lineHeight: 1.55,
                        }}
                      >
                        Select up to two more categories. Scoring methodology is handled behind
                        the scenes.
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                        className="two-grid"
                      >
                        {categories
                          .filter((category) => category !== primaryCategory)
                          .map((category) => {
                            const isSelected = extraCategories.includes(category);

                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => toggleExtraCategory(category)}
                                style={{
                                  textAlign: "left",
                                  padding: "16px 18px",
                                  borderRadius: 18,
                                  border: isSelected ? "2px solid #dc2626" : "1px solid #d1d5db",
                                  background: isSelected ? "#fef2f2" : "#ffffff",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  fontWeight: 800,
                                  color: "#111827",
                                  boxShadow: isSelected ? "0 8px 18px rgba(220,38,38,0.08)" : "none",
                                }}
                              >
                                {category}
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 14,
                        fontSize: 14,
                        color: "#6b7280",
                        lineHeight: 1.6,
                      }}
                    >
                      Selected: {allSelectedCategories.length ? allSelectedCategories.join(", ") : "None yet"}
                    </div>
                  </div>

                  <div style={{ marginBottom: 36 }}>
                    <div style={stepTitleStyle}>4. Score and comment</div>

                    <div
                      style={{
                        background: "#fafafa",
                        border: "1px solid #ececec",
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 22,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                          gap: 12,
                        }}
                      >
                        <FieldLabel>Overall culture score</FieldLabel>
                        <div style={{ fontSize: 36, fontWeight: 900, color: "#111827" }}>{score}</div>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        style={{ width: "100%" }}
                      />

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#6b7280",
                          fontSize: 12,
                          marginTop: 6,
                        }}
                      >
                        <span>1</span>
                        <span>100</span>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>What do you value most about working at your company?</FieldLabel>
                      <TextAreaInput
                        placeholder="Tell us what makes the culture stand out"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 20,
                      padding: 18,
                      marginBottom: 28,
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ marginTop: 4 }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          color: "#374151",
                          lineHeight: 1.65,
                        }}
                      >
                        I confirm that I currently work at this company and understand submissions
                        may be reviewed for authenticity, duplicate voting, and suspicious activity.
                      </span>
                    </label>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "center",
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: 24,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, maxWidth: 520 }}>
                      Quick enough for employees to complete, but structured enough to support
                      credible recognition outcomes.
                    </div>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      style={{
                        padding: "16px 30px",
                        borderRadius: 18,
                        border: "none",
                        background: canSubmit
                          ? "linear-gradient(90deg, #b91c1c, #ef4444)"
                          : "#d1d5db",
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: 900,
                        cursor: canSubmit ? "pointer" : "not-allowed",
                        boxShadow: canSubmit ? "0 14px 26px rgba(220,38,38,0.22)" : "none",
                      }}
                    >
                      Submit ballot
                    </button>
                  </div>
                </div>
              </form>
            </SectionCard>

            <div style={{ display: "grid", gap: 18 }}>
              <SectionCard>
                <div style={{ padding: 24 }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 900 }}>
                    Live ballot summary
                  </h3>
                  <p
                    style={{
                      margin: "0 0 18px",
                      fontSize: 14,
                      color: "#6b7280",
                      lineHeight: 1.6,
                    }}
                  >
                    A real time preview of the submission profile being built.
                  </p>

                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 18,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>Company</div>
                    <div style={{ fontWeight: 900 }}>{companyName || "Not entered"}</div>
                    {companyName && (
                      <div style={{ marginTop: 6, color: "#6b7280", fontSize: 14 }}>
                        {industry || "Unspecified"} · {companySize || "Unspecified"}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 18,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>
                      Category selections
                    </div>
                    {allSelectedCategories.length ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {allSelectedCategories.map((item) => (
                          <span
                            key={item}
                            style={{
                              display: "inline-block",
                              background: "#ffffff",
                              border: "1px solid #d1d5db",
                              borderRadius: 999,
                              padding: "8px 12px",
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#6b7280", fontSize: 14 }}>No categories selected</div>
                    )}
                  </div>

                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 18,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>
                      Overall culture score
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 900 }}>{score}</div>
                  </div>

                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>
                      Editorial quote potential
                    </div>
                    <div style={{ color: "#374151", fontSize: 14, lineHeight: 1.65 }}>
                      {comment || "Employee comment will appear here for editorial review and possible winner write ups."}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard dark>
                <div style={{ padding: 24, color: "#fff" }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 900 }}>
                    Recognition framework
                  </h3>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 1.7 }}>
                    Category selections, score patterns, written feedback, industry grouping, and
                    company size context all help shape the final evaluation approach.
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === "methodology" && (
          <SectionCard>
            <div style={{ padding: 32 }}>
              <Eyebrow>Methodology</Eyebrow>
              <h2 style={{ margin: "0 0 10px", fontSize: 38, fontWeight: 900, letterSpacing: -1 }}>
                How results are developed
              </h2>
              <p
                style={{
                  margin: "0 0 24px",
                  color: "#6b7280",
                  fontSize: 16,
                  lineHeight: 1.7,
                  maxWidth: 860,
                }}
              >
                The program is designed to balance simplicity for participants with enough structure
                to support credible recognition. Employee ballots identify standout culture
                categories, provide an overall score, and add context through written comments.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}
                className="two-grid"
              >
                <div
                  style={{
                    background: "#f8fafc",
                    padding: 24,
                    borderRadius: 20,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <h3 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 900 }}>
                    What employees provide
                  </h3>
                  <div style={{ color: "#374151", lineHeight: 1.9, fontSize: 15 }}>
                    <div>• Company name, industry, and size</div>
                    <div>• Work identity confirmation</div>
                    <div>• One primary culture category</div>
                    <div>• Up to two additional culture categories</div>
                    <div>• An overall culture score from 1 to 100</div>
                    <div>• A written comment about the workplace experience</div>
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: 24,
                    borderRadius: 20,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <h3 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 900 }}>
                    How submissions are reviewed
                  </h3>
                  <div style={{ color: "#374151", lineHeight: 1.9, fontSize: 15 }}>
                    <div>• Entries may be checked for authenticity</div>
                    <div>• Duplicate and suspicious activity may be screened out</div>
                    <div>• Industry and company size context may be considered</div>
                    <div>• Final recognition is based on the overall review of ballot patterns</div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#111111",
                  color: "#fff",
                  padding: 24,
                  borderRadius: 22,
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>
                  Why the methodology stays simple on the front end
                </div>
                <div style={{ color: "rgba(255,255,255,0.74)", lineHeight: 1.7, fontSize: 15 }}>
                  The public experience is intentionally straightforward. Employees should be able
                  to participate quickly, while the underlying review process remains disciplined
                  enough to support credible editorial recognition.
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {activeTab === "timeline" && (
          <SectionCard>
            <div style={{ padding: 32 }}>
              <Eyebrow>Timeline</Eyebrow>
              <h2 style={{ margin: "0 0 10px", fontSize: 38, fontWeight: 900, letterSpacing: -1 }}>
                Program schedule
              </h2>
              <p
                style={{
                  margin: "0 0 24px",
                  color: "#6b7280",
                  fontSize: 16,
                  lineHeight: 1.7,
                }}
              >
                Key dates for participation, review, publication, and event recognition.
              </p>

              <div style={{ display: "grid", gap: 14 }}>
                {[
                  ["Voting Period", "October 1 through November 10"],
                  ["Results Finalized", "Mid November"],
                  ["Published in DBusiness", "March / April issue"],
                  ["Awards Event", "Early March"],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    style={{
                      background: index === 0 ? "#111111" : "#f8fafc",
                      color: index === 0 ? "#ffffff" : "#111827",
                      borderRadius: 20,
                      padding: 20,
                      border: index === 0 ? "none" : "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 6, fontSize: 18 }}>{title}</div>
                    <div style={{ color: index === 0 ? "rgba(255,255,255,0.76)" : "#6b7280" }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "22px 24px 34px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            color: "#6b7280",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <div>© DBusiness Company Culture Awards</div>
          <div>Employee feedback driven recognition for standout workplace culture in Metro Detroit</div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .hero-grid,
          .vote-grid,
          .field-grid,
          .two-grid,
          .hero-stats,
          .trust-grid {
            grid-template-columns: 1fr !important;
          }
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.08);
        }

        button {
          transition: all 0.2s ease;
        }

        button:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
