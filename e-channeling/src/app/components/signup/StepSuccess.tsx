import Link from "next/link";

export const StepSuccess = () => {
    return (
        <div className="text-center space-y-8 mt-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            <h2 className="text-xl font-bold leading-relaxed">
                Congratulations! You have successfully registered as a Free
                Member!
            </h2>

            <div className="flex justify-center space-x-4 pt-2">
                <button
                    //onClick={() => setStep(4)}
                    className="px-6 py-2 border rounded-full transition-all hover:shadow-md active:scale-95"
                >
                    Previous
                </button>

                <Link href="/login">
                    <button className="px-6 py-2 w-[140px] bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95">
                        Done
                    </button>
                </Link>
            </div>
        </div>
    );
};
