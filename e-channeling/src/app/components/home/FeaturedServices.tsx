import React from "react";
import { Video, TestTube, Pill, FileText, ChevronRight } from "lucide-react";

const FeaturedServices = () => {
    const services = [
        {
            id: 1,
            title: "Teleconsultation",
            description: "Talk to doctors online via video consultation",
            icon: <Video className="w-8 h-8 text-green-500" />,
            linkText: "Learn more",
        },
        {
            id: 2,
            title: "Lab Tests",
            description: "Book lab tests and health checkups",
            icon: <TestTube className="w-8 h-8 text-blue-500" />,
            linkText: "Learn more",
        },
        {
            id: 3,
            title: "Medicines",
            description: "Order medicines and get them delivered",
            icon: <Pill className="w-8 h-8 text-green-500" />,
            linkText: "Learn more",
        },
        {
            id: 4,
            title: "Health Records",
            description: "Store and access your health records securely",
            icon: <FileText className="w-8 h-8 text-blue-500" />,
            linkText: "Learn more",
        },
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Featured Services
                    </h2>
                    <button className="text-blue-500 hover:text-blue-600 font-medium text-sm sm:text-base self-start sm:self-auto">
                        View All
                    </button>
                </div>

                {/* Services Grid  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-2xl transition-shadow"
                        >
                            <div className="mb-3 sm:mb-4">{service.icon}</div>

                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                                {service.title}
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">
                                {service.description}
                            </p>

                            <button className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center group cursor-pointer">
                                {service.linkText}
                                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedServices;
