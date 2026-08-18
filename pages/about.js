import Layout from "../components/Layout";
import { links } from "../lib/data";

export default function About() {
  return (
    <Layout>
      <section className="pageHero">
        <div className="container narrow">
          <div className="eyebrow">About the awards</div>
          <h1>Employee feedback. Meaningful recognition.</h1>
          <p>
            The DBusiness Company Culture Awards recognize Metro Detroit companies
            creating workplace cultures employees are proud to be part of.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow prose">
          <h2>Where winners are recognized</h2>
          <p>
            Award recipients will be featured in the March and April 2027 issue of
            DBusiness magazine, recognized on DBusiness.com, and celebrated at the
            DBusiness Company Culture Awards Breakfast in early March.
          </p>
          <p>
            <a href={links.dbusiness} target="_blank" rel="noreferrer" className="inlineLink">
              Visit DBusiness.com
            </a>
          </p>

          <h2>How the awards work</h2>
          <p>
            Employees identify their company, select the areas where it stands out,
            provide an overall culture score, and share what they value most about
            working there.
          </p>

          <h2>How results are reviewed</h2>
          <p>
            Submissions are reviewed for authenticity and results are evaluated across
            company sizes, industries, and award categories.
          </p>
          <p>
            DBusiness reserves the right to validate submissions and remove duplicate
            or questionable entries to preserve the integrity of the awards.
          </p>

          <h2>Who can participate?</h2>
          <p>
            Employees of companies operating in Metro Detroit may participate. A
            company email address is required for validation.
          </p>

          <div className="eventBox">
            <div className="eyebrow gold">Awards Breakfast</div>
            <h2>Celebrate the honorees with DBusiness.</h2>
            <p>The DBusiness Company Culture Awards Breakfast will take place in early March 2027.</p>
            <div className="ticketSoon large">Tickets on sale in January</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
