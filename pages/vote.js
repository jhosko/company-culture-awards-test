import {useMemo,useState} from "react";
import Layout from "../components/Layout";
import {categories,industries,companySizes} from "../lib/data";

const initial={company:"",industry:"",size:"",name:"",email:"",score:85,comment:"",agree:false};

export default function Vote(){
const [form,setForm]=useState(initial);
const [selections,setSelections]=useState([]);
const [submitted,setSubmitted]=useState(false);
const top=selections[0]||null, extras=selections.slice(1);

const complete=useMemo(()=>{let n=0;if(form.company&&form.industry&&form.size)n++;if(form.name&&form.email)n++;if(selections.length)n++;if(form.score)n++;if(form.comment.trim())n++;if(form.agree)n++;return Math.round(n/6*100)},[form,selections]);
const canSubmit=form.company&&form.industry&&form.size&&form.name&&form.email&&selections.length&&form.comment.trim()&&form.agree;
const update=(k,v)=>setForm(p=>({...p,[k]:v}));
const toggle=c=>setSelections(p=>p.includes(c)?p.filter(x=>x!==c):p.length>=3?p:[...p,c]);
const submit=e=>{e.preventDefault();if(canSubmit){setSubmitted(true);window.scrollTo({top:0,behavior:"smooth"})}};

if(submitted)return <Layout><section className="section"><div className="container narrow"><div className="successCard"><div className="successMark">✓</div><div className="eyebrow">Thank you</div><h1>Your vote is in.</h1><p>Thanks for helping DBusiness recognize the companies building great workplace cultures across Metro Detroit.</p><button className="button" onClick={()=>{setSubmitted(false);setForm(initial);setSelections([])}}>Submit Another Vote</button></div></div></section></Layout>;

return <Layout>
<section className="pageHero compact"><div className="container"><div className="eyebrow">Employee ballot</div><h1>Tell us about your workplace.</h1><p>It only takes a couple of minutes. Your company email is required to help validate submissions.</p></div></section>
<section className="section ballotSection"><div className="container ballotLayout">
<form className="ballot" onSubmit={submit}>
<div className="progressWrap"><div className="progressMeta"><span>Ballot progress</span><strong>{complete}%</strong></div><div className="progressTrack"><div className="progressBar" style={{width:`${complete}%`}}/></div></div>

<BallotSection number="1" title="Your company">
<div className="field full"><label>Company name</label><input value={form.company} onChange={e=>update("company",e.target.value)} placeholder="Enter your company name"/></div>
<div className="field"><label>Industry</label><select value={form.industry} onChange={e=>update("industry",e.target.value)}><option value="">Select industry</option>{industries.map(x=><option key={x}>{x}</option>)}</select></div>
<div className="field"><label>Company size</label><select value={form.size} onChange={e=>update("size",e.target.value)}><option value="">Select company size</option>{companySizes.map(x=><option key={x}>{x}</option>)}</select></div>
</BallotSection>

<BallotSection number="2" title="About you">
<div className="field"><label>Your name</label><input value={form.name} onChange={e=>update("name",e.target.value)} placeholder="First and last name"/></div>
<div className="field"><label>Company email</label><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="name@company.com"/><small>Please use your company domain email. Personal email addresses should not be used.</small></div>
</BallotSection>

<BallotSection number="3" title="What makes your company great?" intro="Choose up to three categories. Your first selection is your top choice.">
<div className="categoryGrid full">{categories.map(c=>{const selected=selections.includes(c);const pos=selections.indexOf(c);return <button type="button" key={c} className={`categoryCard ${selected?"selected":""}`} onClick={()=>toggle(c)}><span className="categoryState">{pos===0?"Top Choice":pos>0?"Selected":"Choose"}</span><strong>{c}</strong></button>})}</div>
<div className="selectionSummary full"><div><span>Top choice</span><strong>{top||"Not selected yet"}</strong></div><div><span>Additional choices</span><strong>{extras.length?extras.join(" • "):"Optional"}</strong></div></div>
</BallotSection>

<BallotSection number="4" title="Overall culture">
<div className="scoreBlock full"><div className="scoreHeader"><div><label>How would you rate your company culture?</label><p>Use the scale below to give your overall score.</p></div><div className="scoreNumber">{form.score}</div></div><input className="scoreSlider" type="range" min="1" max="100" value={form.score} onChange={e=>update("score",Number(e.target.value))}/><div className="scoreScale"><span>1</span><span>100</span></div></div>
<div className="field full"><label>What do you love most about working here?</label><textarea value={form.comment} onChange={e=>update("comment",e.target.value)} placeholder="Tell us what makes your workplace special." rows="6"/><small>Your response may be used in DBusiness coverage of the Company Culture Awards.</small></div>
</BallotSection>

<div className="confirmationBox"><label className="checkLabel"><input type="checkbox" checked={form.agree} onChange={e=>update("agree",e.target.checked)}/><span>I confirm that I currently work for this company and that the information I provided is accurate.</span></label><p>Submissions are subject to review and verification to help protect the integrity of the awards.</p></div>
<button className="button buttonLarge submitButton" type="submit" disabled={!canSubmit}>Submit My Vote</button>
</form>

<aside className="ballotAside"><div className="asideCard"><div className="eyebrow">Voting closes</div><div className="bigDate">NOV 10</div><p>Make your voice count before voting closes.</p></div><div className="asideCard"><h3>What happens next?</h3><p>DBusiness reviews submissions and recognizes standout companies across award categories, industries, and company sizes.</p></div></aside>
</div></section></Layout>
}

function BallotSection({number,title,intro,children}){return <section className="ballotCard"><div className="ballotHeading"><span>{number}</span><div><h2>{title}</h2>{intro&&<p>{intro}</p>}</div></div><div className="fieldGrid">{children}</div></section>}
