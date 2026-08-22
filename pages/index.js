import Link from "next/link";
import Layout from "../components/Layout";
import { categories } from "../lib/data";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

export default function Home({ cms }) {
  const headline = cms.homepage_headline || "Do you love where you work?";
  const intro =
    cms.homepage_intro ||
    "Tell us what makes your company a great place to work and help it earn recognition in the DBusiness Company Culture Awards.";

  const votingOpen = formatDate(cms.voting_open_date || "2026-10-01");
  const votingClose = formatDate(cms.voting_close_date || "2026-11-10");

  return (
    <Layout>
      <section className="hero heroRefined">
        <div className="container heroGrid">
          <div className="heroCopy">
            <div className="eyebrow">DBusiness Company Culture Awards</div>
            <h1>{headline}</h1>
            <p className="heroLead">{intro}</p>

            <div className="heroActions">
              <Link href="/vote" className="button buttonLarge">Vote Now</Link>
              <Link href="/about" className="textLink">Learn about the awards</Link>
            </div>

            <div className="deadlineStrip">
              <span className="deadlineLabel">Voting</span>
              <span>{votingOpen} through {votingClose}</span>
            </div>
          </div>

          <div className="heroAwardVisual">
            <img
              src="/company-culture-awards-breakfast.jpg"
              alt="DBusiness Breakfast Series Company Culture Awards"
              className="heroAwardImage"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionIntro">
            <div className="eyebrow">How it works</div>
            <h2>Three quick ways to tell us about your workplace.</h2>
          </div>

          <div className="stepsGrid">
            <article className="stepCard">
              <div className="stepNumber">01</div>
              <h3>Choose what your company does best.</h3>
              <p>Select the culture categories where your company truly stands out.</p>
            </article>

            <article className="stepCard">
              <div className="stepNumber">02</div>
              <h3>Rate your company culture.</h3>
              <p>Give your overall workplace culture a score from 1 to 100.</p>
            </article>

            <article className="stepCard">
              <div className="stepNumber">03</div>
              <h3>Tell us why.</h3>
              <p>Share what you love most about working there.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section sectionNavy">
        <div className="container">
          <div className="sectionIntro light">
            <div className="eyebrow gold">Award categories</div>
            <h2>What makes a great culture?</h2>
            <p>
              Employees can recognize the areas where their company delivers an
              exceptional workplace experience.
            </p>
          </div>

          <div className="categoryPreview">
            {categories.map((category, index) => (
              <div className="categoryPreviewItem" key={category}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {category}
              </div>
            ))}
          </div>

          <div className="centerAction">
            <Link href="/vote" className="button buttonGold">Cast Your Vote</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const fallback = {
    homepage_headline: "Do you love where you work?",
    homepage_intro:
      "Tell us what makes your company a great place to work and help it earn recognition in the DBusiness Company Culture Awards.",
    voting_open_date: "2026-10-01",
    voting_close_date: "2026-11-10"
  };

  if (!supabaseUrl || !serviceRoleKey) {
    return { props: { cms: fallback } };
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/site_content?select=content_key,content_value`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`
        }
      }
    );

    const rows = await response.json();

    if (!response.ok || !Array.isArray(rows)) {
      return { props: { cms: fallback } };
    }

    const cms = { ...fallback };
    rows.forEach(row => {
      if (row?.content_key) cms[row.content_key] = row.content_value || "";
    });

    return { props: { cms } };
  } catch {
    return { props: { cms: fallback } };
  }
}
