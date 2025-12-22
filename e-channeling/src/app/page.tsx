"use client";
import HeroSection from "../components/home/HeroSection";
import FeaturedServices from "../components/home/FeaturedServices";
import MembershipSection from "../components/home/MembershipSection";
import Welcome from "@/components/home/Welcome";
import QuickAccess from "../components/home/QuickAccess";
import Snowfall from "react-snowfall";

export default function Home() {
    return (
        <main className="min-h-screen px-5 sm:px-15 pt-8">
            <Snowfall
                color="white"
                snowflakeCount={200}
                style={{
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 9999,
                    pointerEvents: "none",
                }}
            />
            {/* Landing Page */}
            <HeroSection />
            <Welcome />
            <FeaturedServices />
            <MembershipSection />
            <QuickAccess />
        </main>
    );
}
