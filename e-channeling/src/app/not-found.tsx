import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex h-screen flex-col items-center justify-center bg-black text-white px-6">
            <h1 className="text-7xl font-extrabold tracking-widest">404</h1>

            <p className="mt-4 text-xl text-gray-400">
                Oops! The page you are looking for does not exist.
            </p>

            <div className="mt-8 flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 rounded-lg bg-[#0070f3] text-white font-medium hover:bg-[#0366d6] transition"
                >
                    Go Back Home
                </Link>
                <Link
                    href="/contact"
                    className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 font-medium hover:border-white hover:text-white transition"
                >
                    Contact Support
                </Link>
            </div>

            <div className="mt-12 w-32 h-1 bg-[#0070f3] rounded-full"></div>
        </main>
    );
}
