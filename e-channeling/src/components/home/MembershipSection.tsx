import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import Link from "next/link";

const MembershipSection = () => {
    const benefits = [
        {
            id: 1,
            title: "Priority appointment booking",
            icon: <Check className="w-5 h-5 text-white" />,
        },
        {
            id: 2,
            title: "Discounts on consultations",
            icon: <Check className="w-5 h-5 text-white" />,
        },
        {
            id: 3,
            title: "24/7 doctor support",
            icon: <Check className="w-5 h-5 text-white" />,
        },
        {
            id: 4,
            title: "Free health checkups",
            icon: <Check className="w-5 h-5 text-white" />,
        },
    ];

    return (
        <section className="bg-gradient-to-r from-blue-500 to-green-500 py-12 sm:py-16 px-4 sm:px-6 mx-4 sm:mx-0 rounded-xl sm:rounded-2xl">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-white text-center lg:text-left">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                            Get Premium Membership
                        </h2>

                        <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8">
                            Enjoy priority booking, discounts and more benefits
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.id}
                                    className="flex items-center justify-center lg:justify-start gap-3"
                                >
                                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                                        {benefit.icon}
                                    </div>
                                    <span className="text-white font-medium text-sm sm:text-base">
                                        {benefit.title}
                                    </span>
                                </div>
                            ))}
                        </div>

                    <Link
                    className="mt-6 sm:mt-8 w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-50 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base cursor-pointer"
                    href="/help"
                    >
                    Upgrade Membership
                    </Link>

                    </div>

                    {/* Right Image  */}
                    <div className="w-full lg:flex-none lg:w-96 mt-6 lg:mt-0">
                        <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden mx-auto max-w-md lg:max-w-none">
                            <Image
                                src="/member.jpeg"
                                alt="Doctor consultation"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MembershipSection;
