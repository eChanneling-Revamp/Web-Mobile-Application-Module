import HeroSection from "../components/home/HeroSection";
import FeaturedServices from "../components/home/FeaturedServices";
import MembershipSection from "../components/home/MembershipSection";
import FeaturedDoctors from "../components/home/FeaturedDoctors";

export default function Home() {
    return (
        <main className="min-h-screen px-5 sm:px-15 pt-8">
            {/* Landing Page */}
            <HeroSection />
            <FeaturedServices />
            <MembershipSection />
            <FeaturedDoctors />
        </main>
    );
}
