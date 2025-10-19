import React from "react";
import Link from "next/link";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Phone,
    Mail,
} from "lucide-react";

const Footer = () => {
    const quickLinks = [
        { name: "Find a Doctor", href: "/search" },
        { name: "Book Appointment", href: "/book-appointment" },
        { name: "Teleconsultation", href: "/teleconsultation" },
        { name: "Lab Tests", href: "/lab-tests" },
        { name: "Medicines", href: "/medicines" },
    ];

    const doctorLinks = [
        { name: "Register as Doctor", href: "/doctor/register" },
        { name: "Doctor Login", href: "/doctor/login" },
    ];

    const hospitalLinks = [
        { name: "Partner with Us", href: "/hospital/partner" },
        { name: "Hospital Login", href: "/hospital/login" },
    ];

    const companyLinks = [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Help Center", href: "/help" },
    ];

    const socialLinks = [
        {
            name: "Facebook",
            href: "#",
            icon: <Facebook className="w-5 h-5" />,
        },
        {
            name: "Twitter",
            href: "#",
            icon: <Twitter className="w-5 h-5" />,
        },
        {
            name: "Instagram",
            href: "#",
            icon: <Instagram className="w-5 h-5" />,
        },
        {
            name: "LinkedIn",
            href: "#",
            icon: <Linkedin className="w-5 h-5" />,
        },
    ];

    return (
        <footer className="bg-gray-50 border-t border-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-13 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
                    {/* Quick Links */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-gray-800 font-semibold text-lg mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3 text-center sm:text-left">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center sm:text-left">
                        <h3 className="text-gray-800 font-semibold text-lg mb-4">
                            For Doctors
                        </h3>
                        <ul className="space-y-3 text-center sm:text-left">
                            {doctorLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-gray-800 font-semibold text-lg mb-4 mt-8">
                            For Hospitals
                        </h3>
                        <ul className="space-y-3 text-center sm:text-left">
                            {hospitalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center sm:text-left">
                        <h3 className="text-gray-800 font-semibold text-lg mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3 text-center sm:text-left">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center lg:text-right">
                        <h3 className="text-gray-800 font-semibold text-lg mb-4">
                            Connect with us
                        </h3>

                        <div className="flex items-center justify-center lg:justify-end space-x-4 mb-6">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    className="text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-center lg:justify-end space-x-3">
                                <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">
                                    +94 11 2 100 100
                                </span>
                            </div>

                            <div className="flex items-center justify-center lg:justify-end space-x-3">
                                <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">
                                    support@echannelling.com
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 mt-12 pt-8">
                    <div className="text-center text-gray-500 text-sm">
                        © 2025 eChannelling by SLT Mobitel. All rights
                        reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
