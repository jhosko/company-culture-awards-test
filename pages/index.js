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

export default function Home({ cms, sponsors }) {
  const value = (key, fallback) => cms[key] || fallback;

  const votingOpen = formatDate(value("voting_open_date", "2026-10-01"));
  const votingClose = formatDate(value("voting_close_date", "2026-11-10"));

  return (
    <Layout>
      <section className="hero heroRefined">
        <div className="container heroGrid">
          <div className="heroCopy">
            <div className="eyebrow">DBusiness Company Culture Awards</div>
            <h1>{value("homepage_headline", "Do you love where you work?")}</h1>
            <p className="heroLead">
              {value(
                "homepage_intro",
                "Tell us what makes your company a great place to work and help it earn recognition in the DBusiness Company Culture Awards."
              )}
            </p>

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

      {sponsors.length > 0 && (
        <section className="sponsorStrip">
          <div className="container">
            <div className="sponsorStripHeading">
              {value("sponsor_heading", "Thank You to Our Sponsors")}
            </div>

            <div className="sponsorLogoRow">
              {sponsors.map(sponsor => {
                const logo = (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    loading="lazy"
                  />
                );

                return sponsor.website_url ? (
                  <a
                    key={sponsor.id}
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="sponsorLogoItem"
                    title={sponsor.name}
                  >
                    {logo}
                  </a>
                ) : (
                  <div
                    key={sponsor.id}
                    className="sponsorLogoItem"
                    title={sponsor.name}
                  >
                    {logo}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="sectionIntro">
            <div className="eyebrow">How it works</div>
            <h2>
              {value(
                "how_it_works_heading",
                "Three quick ways to tell us about your workplace."
              )}
            </h2>
          </div>

          <div className="stepsGrid">
            <article className="stepCard">
              <div className="stepNumber">01</div>
              <h3>{value("step_1_title", "Choose what your company does best.")}</h3>
              <p>
                {value(
                  "step_1_body",
                  "Select the culture categories where your company truly stands out."
                )}
              </p>
            </article>

            <article className="stepCard">
              <div className="stepNumber">02</div>
              <h3>{value("step_2_title", "Rate your company culture.")}</h3>
              <p>
                {value(
                  "step_2_body",
                  "Give your overall workplace culture a score from 1 to 100."
                )}
              </p>
            </article>

            <article className="stepCard">
              <div className="stepNumber">03</div>
              <h3>{value("step_3_title", "Tell us why.")}</h3>
              <p>
                {value(
                  "step_3_body",
                  "Share what you love most about working there."
                )}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section sectionNavy">
        <div className="container">
          <div className="sectionIntro light">
            <div className="eyebrow gold">Award categories</div>
            <h2>{value("categories_heading", "What makes a great culture?")}</h2>
            <p>
              {value(
                "categories_intro",
                "Employees can recognize the areas where their company delivers an exceptional workplace experience."
              )}
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

      <section className="section">
        <div className="container recognitionCallout">
          <div>
            <div className="eyebrow">Recognition that travels</div>
            <h2>
              {value(
                "recognition_heading",
                "Featured in print, online, and celebrated live."
              )}
            </h2>
            <p>
              {value(
                "recognition_body",
                "Award recipients will be featured in DBusiness magazine, recognized on DBusiness.com, and celebrated at the DBusiness Company Culture Awards Breakfast."
              )}
            </p>
          </div>
          <Link href="/about" className="button buttonNavy">Learn More</Link>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const fallbackCms = {};

  if (!supabaseUrl || !serviceRoleKey) {
    return { props: { cms: fallbackCms, sponsors: [] } };
  }

  try {
    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    };

    const [contentResponse, sponsorsResponse] = await Promise.all([
      fetch(
        `${supabaseUrl}/rest/v1/site_content?select=content_key,content_value`,
        { headers }
      ),
      fetch(
        `${supabaseUrl}/rest/v1/sponsors?select=id,name,logo_url,website_url,sponsor_tier,display_order&active=eq.true&order=display_order.asc`,
        { headers }
      )
    ]);

    const contentRows = await contentResponse.json();
    const sponsorRows = await sponsorsResponse.json();

    const cms = {};
    if (contentResponse.ok && Array.isArray(contentRows)) {
      contentRows.forEach(row => {
        if (row?.content_key) cms[row.content_key] = row.content_value || "";
      });
    }

    return {
      props: {
        cms,
        sponsors: sponsorsResponse.ok && Array.isArray(sponsorRows) ? sponsorRows : []
      }
    };
  } catch {
    return { props: { cms: fallbackCms, sponsors: [] } };
  }
}
