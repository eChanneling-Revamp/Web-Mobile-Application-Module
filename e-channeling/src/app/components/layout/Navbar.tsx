"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Globe, User, Bell, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // get auth status
    const { userToken, isLoginSuccess } = useSelector(
        (state: RootState) => state.auth
    );
    // const isAuthenticated =
    //     isLoginSuccess && userToken && Object.keys(userToken).length > 0;

    const isAuthenticated = true;

    // mobile nav bar
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        setIsProfileDropdownOpen(false);
        router.push("/");
    };

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(false);
        router.push("/profile");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // if the clicked element is NOT inside the dropdown element
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };

        // When you press the mouse button (left, right, or middle) — the mousedown event triggers immediately.
        if (isProfileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

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
                            href="/search"
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

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        {!isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300">
                                    <Globe className="w-5 h-5 mr-1" />
                                    <span className="font-medium">English</span>
                                </div>
                                <Link
                                    href="/login"
                                    className="px-[14px] py-[5px] bg-blue-600 text-white rounded-full font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Sign In
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 sm:space-x-4 ">
                                <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-600 rounded hover:text-black cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ">
                                    <Globe className="w-5 h-5 mr-1" />
                                    <span className="font-medium">English</span>
                                </div>
                                <button
                                    className="relative p-2 text-gray-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 "
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-5 h-5 hover:text-black" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow text-[10px] text-center">
                                        3
                                    </span>
                                </button>

                                <div
                                    className="relative flex"
                                    ref={dropdownRef}
                                >
                                    <div
                                        onClick={toggleProfileDropdown}
                                        className={`border rounded-full p-2 border-gray-400/80 cursor-pointer transition-colors hover:bg-gray-200 ${isProfileDropdownOpen ? "bg-gray-200" : ""}`}
                                        aria-haspopup="menu"
                                        aria-expanded={isProfileDropdownOpen}
                                        aria-label="Open profile menu"
                                    >
                                        <User className="w-5.5 h-5 text-gray-700 hover:text-black " />
                                    </div>

                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-9.5 w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                                            <button
                                                onClick={handleProfileClick}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer hover:rounded-t-lg border-b border-gray-300"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-200 hover:rounded-b-lg cursor-pointer"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
