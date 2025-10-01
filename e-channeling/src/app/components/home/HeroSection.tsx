import React from "react";

const HeroSection = () => {
    // with bg image
    return (
        <section
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

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 max-w-3xl mx-auto shadow-lg">
                    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Search by doctor, specialty or hospital"
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="flex-1">
                                <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white text-sm sm:text-base cursor-pointer">
                                    <option>All Specialties</option>
                                    <option>Cardiology</option>
                                    <option>Dermatology</option>
                                    <option>Neurology</option>
                                    <option>Pediatrics</option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white text-sm sm:text-base cursor-pointer">
                                    <option>All Locations</option>
                                    <option>Colombo</option>
                                    <option>Kandy</option>
                                    <option>Galle</option>
                                    <option>Jaffna</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base cursor-pointer">
                        Find
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
