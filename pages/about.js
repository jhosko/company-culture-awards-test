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

          <h2>Methodology</h2>
          <p>
            The DBusiness Company Culture Awards are based on feedback submitted directly
            by employees. Participants identify their company, select the areas where it
            stands out, provide an overall culture score, and share what they value most
            about working there.
          </p>
          <p>
            To help ensure the integrity of the program, participants must submit a valid
            company email address and verify their submission before it is included in the
            results. Personal email addresses and shared company inboxes are not accepted.
          </p>
          <p>
            Results are reviewed across company sizes, industries, and award categories.
            Companies must receive sufficient verified employee participation to qualify
            for recognition. DBusiness may combine company size divisions or withhold an
            award when participation does not support a meaningful result.
          </p>
          <p>
            DBusiness also reviews submissions for duplicate, unverifiable, or questionable
            activity and reserves the right to exclude entries when necessary to preserve
            the credibility of the awards.
          </p>

          <h2>Company size divisions</h2>
          <p>
            Eligible companies must have at least 10 employees. Companies are grouped into
            three size divisions:
          </p>
          <p>
            <strong>Small:</strong> 10 to 49 employees<br />
            <strong>Medium:</strong> 50 to 249 employees<br />
            <strong>Large:</strong> 250 or more employees
          </p>

          <h2>Who can participate?</h2>
          <p>
            Employees of companies operating in Metro Detroit with at least 10 employees
            may participate. A company email address is required for verification.
          </p>

          <div className="eventBox">
            <div>
              <div className="eyebrow gold">Awards Breakfast</div>
              <h2>Celebrate the honorees with DBusiness.</h2>
              <p>
                The DBusiness Company Culture Awards Breakfast will take place in early March 2027.
              </p>
            </div>
            <div className="ticketSoon large">Tickets on sale in January</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
