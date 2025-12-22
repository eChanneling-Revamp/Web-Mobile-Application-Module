import React from "react";

// replace with your actual image path
// import heroImg from "../assets/welcome-hero.png";
const Welcome = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-8 sm:py-10">
      <div className="mx-0 sm:mx-4 lg:mx-0 rounded-2xl border border-black/5 bg-white shadow-sm overflow-hidden">
        
        {/* RESPONSIVE LAYOUT */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[300px]">

          {/* LEFT CONTENT */}
          <div className="w-full md:w-[42%] flex flex-col justify-center gap-3 px-6 sm:px-8 md:px-10 py-6 md:py-0">
            <h1 className="text-[26px] sm:text-[30px] md:text-[34px] lg:text-[36px] leading-tight font-bold text-[#0B66D0]">
              Welcome to <br className="hidden sm:block" /> E-Channeling
            </h1>

            <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed text-[#0B66D0]/65 max-w-full md:max-w-[420px]">
             Sri Lanka’s trusted digital healthcare platform.
             We make it easy to connect with doctors, manage appointments,
            and access essential healthcare services anytime, anywhere.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full md:w-[58%] h-[220px] sm:h-[260px] md:h-full overflow-hidden bg-[#F3F6FB]">
            
            {/* Image */}
            <img
              src="/welcome1.jpeg"
              alt="Hospital welcome"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Blur band (desktop only) */}
            <div className="hidden md:block absolute inset-y-0 left-0 w-[5%] backdrop-blur-md" />

            {/* White fade (desktop only) */}
            <div className="hidden md:block absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-white via-white/70 to-transparent" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Welcome;
