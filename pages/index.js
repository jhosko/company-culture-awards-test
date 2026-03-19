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

function SectionCard({ children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
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
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 8,
        color: "#111827",
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
        padding: "14px 16px",
        borderRadius: 16,
        border: "2px solid #e5e7eb",
        outline: "none",
        fontSize: 16,
        boxSizing: "border-box",
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
        padding: "14px 16px",
        borderRadius: 16,
        border: "2px solid #e5e7eb",
        outline: "none",
        fontSize: 16,
        background: "#fff",
        boxSizing: "border-box",
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
        padding: "14px 16px",
        borderRadius: 16,
        border: "2px solid #e5e7eb",
        outline: "none",
        fontSize: 16,
        minHeight: 140,
        boxSizing: "border-box",
        resize: "vertical",
        ...(props.style || {}),
      }}
    />
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
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
  });

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
            "radial-gradient(circle at top left, rgba(0,0,0,0.05), transparent 35%), linear-gradient(135deg, #f3f4f6 0%, #ffffff 45%, #f8fafc 100%)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "64px 24px 72px",
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
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#b91c1c",
                  marginBottom: 18,
                  letterSpacing: 0.5,
                }}
              >
                DBusiness
              </div>

              <h1
                style={{
                  fontSize: 64,
                  lineHeight: 0.95,
                  margin: "0 0 18px",
                  fontWeight: 900,
                  letterSpacing: -1.5,
                }}
              >
                COMPANY <span style={{ color: "#dc2626" }}>CULTURE</span> AWARDS
              </h1>

              <p
                style={{
                  fontSize: 20,
                  lineHeight: 1.6,
                  color: "#4b5563",
                  maxWidth: 720,
                  marginBottom: 28,
                }}
              >
                Recognizing companies across Metro Detroit with standout workplace
                cultures, as rated by the people who work there.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button
                  onClick={() => setActiveTab("vote")}
                  style={{
                    background: "#111111",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 18,
                    padding: "16px 24px",
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
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
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View methodology
                </button>
              </div>
            </div>

            <SectionCard>
              <div style={{ padding: 28 }}>
                <h2 style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 900 }}>
                  How it works
                </h2>
                <p
                  style={{
                    margin: "0 0 22px",
                    color: "#6b7280",
                    fontSize: 16,
                    lineHeight: 1.6,
                  }}
                >
                  A quick vote from employees helps identify companies with standout
                  cultures.
                </p>

                {[
                  {
                    title: "1. Employees vote",
                    text: "Nominate your company, choose up to three categories, rate overall culture, and share a quick comment.",
                  },
                  {
                    title: "2. Submissions are reviewed",
                    text: "Entries are checked to help ensure results reflect real employee feedback.",
                  },
                  {
                    title: "3. Winners are recognized",
                    text: "Top companies are recognized across categories, company sizes, and industries.",
                  },
                ].map((step) => (
                  <div
                    key={step.title}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: 18,
                      borderRadius: 20,
                      border: "1px solid #e5e7eb",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        minWidth: 40,
                        borderRadius: 14,
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#b91c1c",
                        fontWeight: 900,
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>{step.title}</div>
                      <div style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.55 }}>
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "42px 24px 60px" }}>
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
            }}
            className="vote-grid"
          >
            <SectionCard>
              <form onSubmit={handleSubmit}>
                <div style={{ padding: 30 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20,
                      marginBottom: 28,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>
                        Employee Ballot
                      </h2>
                      <p
                        style={{
                          margin: "8px 0 0",
                          color: "#6b7280",
                          fontSize: 16,
                          lineHeight: 1.6,
                          maxWidth: 620,
                        }}
                      >
                        Choose one primary culture strength, add up to two more
                        categories, then score the company overall.
                      </p>
                    </div>

                    <div style={{ minWidth: 150 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          marginBottom: 8,
                          textAlign: "right",
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
                            background: "linear-gradient(90deg, #dc2626, #ef4444)",
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {submitted && (
                    <div
                      style={{
                        padding: 18,
                        borderRadius: 18,
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        marginBottom: 28,
                      }}
                    >
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>Ballot submitted</div>
                      <div style={{ color: "#065f46", lineHeight: 1.55 }}>
                        Your submission has been received and will be reviewed as part of
                        the overall results.
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: 34 }}>
                    <div
                      style={{
                        color: "#b91c1c",
                        fontWeight: 900,
                        marginBottom: 14,
                        fontSize: 20,
                      }}
                    >
                      1. Tell us where you work
                    </div>

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
                          background: "#f3f4f6",
                          borderRadius: 18,
                          padding: 16,
                          color: "#6b7280",
                          fontSize: 14,
                          lineHeight: 1.55,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Choose the industry and size that best match your company today.
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 34 }}>
                    <div
                      style={{
                        color: "#111827",
                        fontWeight: 900,
                        marginBottom: 14,
                        fontSize: 20,
                      }}
                    >
                      2. Verify your connection
                    </div>

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
                            lineHeight: 1.5,
                          }}
                        >
                          Please use your company domain email. Personal email addresses
                          should not be used.
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 14,
                        color: "#6b7280",
                        lineHeight: 1.55,
                      }}
                    >
                      Submissions may be reviewed for domain match, duplication, and other
                      signs of suspicious activity.
                    </div>
                  </div>

                  <div style={{ marginBottom: 34 }}>
                    <div
                      style={{
                        color: "#111827",
                        fontWeight: 900,
                        marginBottom: 14,
                        fontSize: 20,
                      }}
                    >
                      3. Choose up to 3 culture categories
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <FieldLabel>Primary category</FieldLabel>
                      <SelectInput
                        value={primaryCategory}
                        onChange={(e) => setPrimaryCategory(e.target.value)}
                      >
                        <option value="">Select the category where your company stands out most</option>
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
                          lineHeight: 1.5,
                        }}
                      >
                        Choose up to two more categories. We will handle the weighting
                        behind the scenes.
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
                                  border: isSelected
                                    ? "2px solid #dc2626"
                                    : "1px solid #d1d5db",
                                  background: isSelected ? "#fef2f2" : "#ffffff",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: "#111827",
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
                        marginTop: 12,
                        fontSize: 14,
                        color: "#6b7280",
                        lineHeight: 1.55,
                      }}
                    >
                      Selected: {allSelectedCategories.length ? allSelectedCategories.join(", ") : "None yet"}
                    </div>
                  </div>

                  <div style={{ marginBottom: 34 }}>
                    <div
                      style={{
                        color: "#111827",
                        fontWeight: 900,
                        marginBottom: 14,
                        fontSize: 20,
                      }}
                    >
                      4. Score and comment
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <FieldLabel>Overall culture score</FieldLabel>
                        <div style={{ fontSize: 32, fontWeight: 900 }}>{score}</div>
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
                      <FieldLabel>
                        What do you value most about working at your company?
                      </FieldLabel>
                      <TextAreaInput
                        placeholder="Tell us what makes the culture special"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 18,
                      padding: 18,
                      marginBottom: 26,
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
                          lineHeight: 1.6,
                        }}
                      >
                        I confirm I currently work at this company and understand
                        submissions may be reviewed for authenticity, duplicate voting,
                        and suspicious activity.
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
                      paddingTop: 22,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.55 }}>
                      Fast to complete for employees, but structured enough to support
                      credible results.
                    </div>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      style={{
                        padding: "16px 28px",
                        borderRadius: 18,
                        border: "none",
                        background: canSubmit
                          ? "linear-gradient(90deg, #dc2626, #ef4444)"
                          : "#d1d5db",
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: 900,
                        cursor: canSubmit ? "pointer" : "not-allowed",
                        boxShadow: canSubmit
                          ? "0 12px 24px rgba(220,38,38,0.22)"
                          : "none",
                      }}
                    >
                      Submit ballot
                    </button>
                  </div>
                </div>
              </form>
            </SectionCard>

            <div>
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
                      lineHeight: 1.55,
                    }}
                  >
                    Preview of what this submission contributes to the model.
                  </p>

                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: 18,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>
                      Company
                    </div>
                    <div style={{ fontWeight: 800 }}>
                      {companyName || "Not entered"}
                    </div>
                    {companyName && (
                      <div style={{ marginTop: 6, color: "#6b7280", fontSize: 14 }}>
                        {industry || "Unspecified"} • {companySize || "Unspecified"}
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
                              fontWeight: 700,
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#6b7280", fontSize: 14 }}>
                        No categories selected
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
                    <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>
                      Overall culture score
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 900 }}>{score}</div>
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
                    <div style={{ color: "#374151", fontSize: 14, lineHeight: 1.6 }}>
                      {comment || "Employee comment will appear here for editorial review and winner write ups."}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === "methodology" && (
          <SectionCard>
            <div style={{ padding: 30 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 34, fontWeight: 900 }}>
                Methodology
              </h2>
              <p
                style={{
                  margin: "0 0 22px",
                  color: "#6b7280",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                Built on employee feedback, with a simple review process to ensure
                quality results.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
                className="two-grid"
              >
                <div
                  style={{
                    background: "#f3f4f6",
                    padding: 24,
                    borderRadius: 20,
                  }}
                >
                  <h3 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 900 }}>
                    What employees do
                  </h3>
                  <div style={{ color: "#374151", lineHeight: 1.8, fontSize: 15 }}>
                    <div>• Nominate their company</div>
                    <div>• Choose up to three categories</div>
                    <div>• Rate overall culture</div>
                    <div>• Share a short comment</div>
                  </div>
                </div>

                <div
                  style={{
                    background: "#f3f4f6",
                    padding: 24,
                    borderRadius: 20,
                  }}
                >
                  <h3 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 900 }}>
                    How results are determined
                  </h3>
                  <div style={{ color: "#374151", lineHeight: 1.8, fontSize: 15 }}>
                    <div>• Category selections and scores are reviewed</div>
                    <div>• Submissions may be validated</div>
                    <div>• Results are considered by company size and industry</div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {activeTab === "timeline" && (
          <SectionCard>
            <div style={{ padding: 30 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 34, fontWeight: 900 }}>
                Timeline
              </h2>
              <p
                style={{
                  margin: "0 0 22px",
                  color: "#6b7280",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                Key dates for participation and recognition.
              </p>

              {[
                ["Voting Period", "October 1 through November 10"],
                ["Results Finalized", "Mid November"],
                ["Published in DBusiness", "March / April issue"],
                ["Awards Event", "Early March"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  style={{
                    background: "#f3f4f6",
                    borderRadius: 18,
                    padding: 18,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: "#6b7280" }}>{text}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .hero-grid,
          .vote-grid,
          .field-grid,
          .two-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
