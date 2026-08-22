import Link from "next/link";
import Layout from "../components/Layout";
import { categories } from "../lib/data";

export default function Home() {
  return (
    <Layout>
      <section className="hero heroRefined">
        <div className="container heroGrid">
          <div className="heroCopy">
            <div className="eyebrow">DBusiness Company Culture Awards</div>
            <h1>Do you love where you work?</h1>
            <p className="heroLead">
              Tell us what makes your company a great place to work and help it earn
              recognition in the DBusiness Company Culture Awards.
            </p>

            <div className="heroActions">
              <Link href="/vote" className="button buttonLarge">Vote Now</Link>
              <Link href="/about" className="textLink">Learn about the awards</Link>
            </div>

            <div className="deadlineStrip">
              <span className="deadlineLabel">Voting</span>
              <span>October 1 through November 10, 2026</span>
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

      <section className="section">
        <div className="container recognitionCallout">
          <div>
            <div className="eyebrow">Recognition that travels</div>
            <h2>Featured in print, online, and celebrated live.</h2>
            <p>
              Award recipients will be featured in DBusiness magazine, recognized on
              DBusiness.com, and celebrated at the DBusiness Company Culture Awards Breakfast.
            </p>
          </div>
          <Link href="/about" className="button buttonNavy">Learn More</Link>
        </div>
      </section>
    </Layout>
  );
}
