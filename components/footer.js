import Link from "next/link";

function Footer(){
    return(
        <footer>
            <div className="info">
                <ul>
                <li><Link href="/contact-us">Contact Us</Link></li>
                <li><Link href="/about-us">About Us</Link></li>
                </ul>
            </div>
            <div className="credit">Designed By Me.</div>
        </footer>
    )
}


export default Footer;