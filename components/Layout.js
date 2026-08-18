import Link from "next/link";
import { useRouter } from "next/router";
import { links } from "../lib/data";

const nav = [["/","Home"],["/vote","Vote"],["/about","About the Awards"],["/timeline","Timeline"]];

export default function Layout({ children }) {
  const router = useRouter();
  return <>
    <header className="siteHeader">
      <div className="container headerInner">
        <Link href="/" className="brand">
          <span className="dbusiness">DBusiness</span>
          <span className="brandTitle">Company Culture Awards</span>
        </Link>
        <nav className="nav">
          {nav.map(([href,label]) => <Link key={href} href={href} className={router.pathname===href?"navLink active":"navLink"}>{label}</Link>)}
          <a href={links.dbusiness} target="_blank" rel="noreferrer" className="navLink">DBusiness.com</a>
        </nav>
        <Link href="/vote" className="button buttonSmall">Vote Now</Link>
      </div>
    </header>
    <main>{children}</main>
    <footer className="footer">
      <div className="container footerGrid">
        <div>
          <div className="dbusiness footerBrand">DBusiness</div>
          <div className="footerTitle">Company Culture Awards</div>
          <p className="footerCopy">Recognizing standout workplace cultures across Metro Detroit.</p>
        </div>
        <div>
          <div className="footerHeading">Explore</div>
          <a href={links.dbusiness} target="_blank" rel="noreferrer">DBusiness.com</a>
          <Link href="/about">About the Awards</Link>
          <Link href="/timeline">Program Timeline</Link>
          <Link href="/vote">Vote Now</Link>
        </div>
        <div>
          <div className="footerHeading">Awards Breakfast</div>
          <div className="footerCopy">Early March 2027</div>
          {links.tickets ? <a href={links.tickets} className="footerTicketLink">Buy Tickets</a> : <div className="ticketSoon">Tickets on sale in January</div>}
        </div>
      </div>
    </footer>
  </>;
}
