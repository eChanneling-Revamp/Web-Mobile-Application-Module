"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Globe, User, Bell, Menu, X } from "lucide-react";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold">
                                    <span className="text-blue-600">e</span>
                                    <span className="text-gray-800">
                                        Channelling
                                    </span>
                                </span>
                            </div>
                        </Link>
                        <p className="hidden sm:block text-xs text-green-600 font-medium ml-2 mt-1">
                            by SLT Mobitel
                        </p>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/find-doctors"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Find Doctors
                        </Link>
                        {/* <Link
                            href="/my-health"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            My Health
                        </Link> */}
                        <Link
                            href="/help"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Help
                        </Link>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <button
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300">
                            <Globe className="w-5 h-5 mr-1" />
                            <span className="font-medium">English</span>
                        </div>

                        <button
                            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
                                3
                            </span>
                        </button>

                        <Link
                            href="/auth/login"
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label={
                            isMobileMenuOpen ? "Close menu" : "Open menu"
                        }
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 transition-transform duration-200" />
                        ) : (
                            <Menu className="w-6 h-6 transition-transform duration-200" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-30 transition-opacity duration-150"
                        onClick={handleLinkClick}
                        style={{ top: "100%" }}
                    />

                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-40 animate-in slide-in-from-top-1 duration-200 ease-out">
                        <div className="flex flex-col space-y-2 py-6 px-4 text-center max-h-96 overflow-y-auto">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150 py-3 px-4 rounded-lg hover:bg-blue-50 active:bg-blue-100"
                                onClick={handleLinkClick}
                            >
                                Home
                            </Link>
                            <Link
                                href="/find-doctors"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150 py-3 px-4 rounded-lg hover:bg-blue-50 active:bg-blue-100"
                                onClick={handleLinkClick}
                            >
                                Find Doctors
                            </Link>
                            {/* <Link
                                href="/my-health"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150 py-3 px-4 rounded-lg hover:bg-blue-50 active:bg-blue-100"
                                onClick={handleLinkClick}
                            >
                                My Health
                            </Link> */}
                            <Link
                                href="/help"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150 py-3 px-4 rounded-lg hover:bg-blue-50 active:bg-blue-100"
                                onClick={handleLinkClick}
                            >
                                Help
                            </Link>
                            <div className="flex items-center justify-center space-x-2 py-3 px-4 text-sm text-gray-600 rounded-lg hover:bg-blue-50 transition-colors duration-150">
                                <Globe className="w-4 h-4" />
                                <span>English</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
