import Link from "next/link";
import { useRouter } from "next/router";

const nav=[["/","Home"],["/vote","Vote"],["/about","About the Awards"],["/timeline","Timeline"]];

export default function Layout({children}) {
  const router=useRouter();
  return <>
    <header className="siteHeader">
      <div className="container headerInner">
        <Link href="/" className="brand">
          <span className="dbusiness">DBusiness</span>
          <span className="brandTitle">Company Culture Awards</span>
        </Link>
        <nav className="nav">
          {nav.map(([href,label])=><Link key={href} href={href} className={router.pathname===href?"navLink active":"navLink"}>{label}</Link>)}
        </nav>
        <Link href="/vote" className="button buttonSmall">Vote Now</Link>
      </div>
    </header>
    <main>{children}</main>
    <footer className="footer">
      <div className="container footerInner">
        <div><div className="dbusiness footerBrand">DBusiness</div><div className="footerTitle">Company Culture Awards</div></div>
        <div className="footerCopy">Recognizing standout workplace cultures across Metro Detroit.</div>
      </div>
    </footer>
  </>;
}
