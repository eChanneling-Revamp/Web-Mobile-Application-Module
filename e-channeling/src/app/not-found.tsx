import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-widest text-center">
                404
            </h1>

            <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-gray-400 text-center max-w-md sm:max-w-lg">
                Oops! The page you are looking for does not exist.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full">
                <Link
                    href="/"
                    className="px-6 py-3 sm:py-4 rounded-lg bg-[#0070f3] text-white font-medium hover:bg-[#0366d6] transition-colors duration-200 text-center text-sm sm:text-base min-w-[160px]"
                >
                    Go Back Home
                </Link>
                <Link
                    href="/contact"
                    className="px-6 py-3 sm:py-4 rounded-lg border border-gray-600 text-gray-300 font-medium hover:border-white hover:text-white transition-colors duration-200 text-center text-sm sm:text-base min-w-[160px]"
                >
                    Contact Support
                </Link>
            </div>

            <div className="mt-12 sm:mt-16 w-24 sm:w-32 md:w-40 h-1 bg-[#0070f3] rounded-full"></div>
        </main>
    );
}
