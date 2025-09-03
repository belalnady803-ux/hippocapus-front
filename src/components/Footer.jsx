import { Link } from "react-router";
import { FaInstagram, FaTelegram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-p4 dark:bg-[#1e1e1e] border-t-2 border-[#DBE0E5] dark:border-dark-Cs mt-20 py-10">
            <div className="container">
                <div className="flex justify-between items-start max-sm:flex-col max-sm:gap-8">
                    <div className="max-w-xs">
                        <h3 className="text-[18px] font-bold text-p2 dark:text-p4 mb-2">Hippocampus</h3>
                        <p className="text-p3 dark:text-[#94ABC7]">
                            Advance Your Medical Career with HippoCampus Academy.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold dark:text-p4 mb-2">Links</h4>
                        <ul className="text-p3 dark:text-[#94ABC7] flex flex-col gap-1">
                            <li><Link to="/courses" className="hover:underline">Courses</Link></li>
                            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold dark:text-p4 mb-2">Follow Us</h4>
                        <div className="flex gap-4 text-p2 dark:text-p4">
                            <a href="https://www.instagram.com/hippocampus.eu?igsh=aHpjMzJwb253YTBt&utm_source=qr"><FaInstagram size={24} /></a>
                            <a href="https://t.me/hippocampus_eu"><FaTelegram size={24} /></a>
                        </div>
                    </div>
                </div>
                <div className="text-center text-p3 dark:text-[#94ABC7] pt-8 mt-8 border-t border-[#DBE0E5] dark:border-dark-Cs">
                    <p>&copy; {new Date().getFullYear()} Hippocampus Academy. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;