import Layout from "../components/Layout";
import Link from "next/link";
const dates=[
["October 1, 2026","Voting Opens","Employees can begin submitting ballots."],
["November 10, 2026","Voting Closes","Final day to submit a vote."],
["January 2027","Breakfast Tickets","Tickets for the Company Culture Awards Breakfast go on sale."],
["March and April 2027","Published in DBusiness","Award recipients are featured in DBusiness magazine and on DBusiness.com."],
["Early March 2027","Awards Breakfast","Companies are celebrated at the DBusiness Company Culture Awards Breakfast."]];
export default function Timeline(){return <Layout><section className="pageHero"><div className="container narrow"><div className="eyebrow">Program timeline</div><h1>Key dates.</h1><p>Mark your calendar for voting, publication, and the awards celebration.</p></div></section><section className="section"><div className="container narrow"><div className="timeline">{dates.map(([d,t,b])=><article className="timelineItem" key={d+t}><div className="timelineDate">{d}</div><div><h2>{t}</h2><p>{b}</p></div></article>)}</div><div className="centerAction timelineAction"><Link href="/vote" className="button buttonLarge">Vote Now</Link></div></div></section></Layout>}
