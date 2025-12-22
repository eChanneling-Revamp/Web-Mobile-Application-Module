import React from "react";
import Image from "next/image";
import Link from "next/link";

const QuickAccess = () => {
  const items = [
    {
      id: 1,
      title: "Doctor App",
      icon: "/doctoricon.png",
      href: "/doctor-app",
      isNew: true,
    },
    {
      id: 2,
      title: "Running Number",
      icon: "/number.png",
      href: "/running-number",
      isNew: false,
    },
  ];

  return (
    // ✅ SAME background as FeaturedServices
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 mb-12 sm:mb-16">

      <div className="max-w-7xl mx-auto">
        
        {/* ✅ SAME heading style as Featured Services */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Quick Access
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="relative bg-[#F6F9FF] hover:bg-white border border-blue-100 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl"
            >
              {/* NEW badge */}
              {item.isNew && (
                <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-semibold">
                  NEW
                </span>
              )}

              {/* Icon container */}
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-blue-100">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={28}
                  height={28}
                />
              </div>

              {/* Card title (matches Featured Services font feel) */}
              <span className="text-sm sm:text-base font-medium text-gray-700">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
