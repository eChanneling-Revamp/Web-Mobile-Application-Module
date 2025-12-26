"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push("/search");
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="px-4 sm:px-6 lg:px-20 py-10 sm:py-12 bg-gradient-to-r from-blue-500 to-green-500 mx-4 sm:mx-0 rounded-2xl relative overflow-hidden"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/hero-img.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white mb-3 sm:mb-4 px-2">
                    Your Health, Our Priority
                </h1>

                <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 px-2">
                    Find and book appointments with top doctors near you
                </p>

                {/* <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 max-w-3xl mx-auto shadow-lg">
                    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Search by doctor, specialty or hospital"
                                value={searchState.keyword}
                                onChange={(e) => {
                                    setSearchState((prev) => ({
                                        ...prev,
                                        keyword: e.target.value,
                                    }));
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRedirect();
                                    }
                                }}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="flex-1">
                                <select
                                    value={searchState.filters.specialty}
                                    onChange={(e) => {
                                        setSearchState((prev) => ({
                                            ...prev,
                                            filters: {
                                                ...prev.filters,
                                                specialty: e.target.value,
                                            },
                                        }));
                                    }}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white text-sm sm:text-base cursor-pointer"
                                >
                                    <option value="">All Specialties</option>
                                    <option value="Cardiology">
                                        Cardiology
                                    </option>
                                    <option value="Dermatology">
                                        Dermatology
                                    </option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">
                                        Pediatrics
                                    </option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <select
                                    value={searchState.filters.location}
                                    onChange={(e) => {
                                        setSearchState((prev) => ({
                                            ...prev,
                                            filters: {
                                                ...prev.filters,
                                                location: e.target.value,
                                            },
                                        }));
                                    }}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white text-sm sm:text-base cursor-pointer"
                                >
                                    <option value="">All Locations</option>
                                    <option value="Colombo">Colombo</option>
                                    <option value="Kandy">Kandy</option>
                                    <option value="Galle">Galle</option>
                                    <option value="Jaffna">Jaffna</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleRedirect}
                        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base cursor-pointer"
                    >
                        Find
                    </button>
                </div> */}

                <div className="mt-10 sm:mt-12 flex justify-center">
                    <div className="w-full max-w-xl sm:max-w-3xl rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl px-6 sm:px-10 py-6 sm:py-8">
                        <h2 className="text-white text-2xl  md:text-3xl font-semibold tracking-tight mb-2">
                            Find Doctors Here
                        </h2>
                        <p className="text-white/80 text-sm sm:text-base mb-6">
                            Search top specialists by location and book
                            instantly.
                        </p>

                        <button
                            onClick={handleRedirect}
                            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 sm:px-8 md:px-8 py-3 sm:py-3.5 md:py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-all cursor-pointer"
                            aria-label="Go to search page"
                        >
                            Search Doctors
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ease-out transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default HeroSection;
