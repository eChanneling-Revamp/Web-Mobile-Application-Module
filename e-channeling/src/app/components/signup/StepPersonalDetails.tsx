export const StepPersonalDetails = () => {
    const handleFinalSubmit = () => {};

    const isSignupError = false;
    const isSignupLoading = false;

    return (
        <form onSubmit={handleFinalSubmit} className="space-y-8">
            <div className="space-y-6">
                <div>
                    <select
                        name="title"
                        //value={formData.title}
                        //onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                        required
                    >
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr.</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        //value={formData.firstName}
                        //onChange={handleInputChange}
                        placeholder="First Name"
                        className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        //value={formData.lastName}
                        //onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        //value={formData.email}
                        //onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                        required
                    />
                </div>

                <div className="bg-gray-50 p-3 rounded-full">
                    <input
                        type="tel"
                        //value={formData.phoneNumber}
                        disabled
                        className="w-full bg-transparent outline-none placeholder:text-gray-500"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="idType"
                            value="NIC"
                            //checked={formData.idType === "NIC"}
                            //onChange={handleInputChange}
                            className="text-indigo-500 focus:ring-indigo-400"
                        />
                        <span>NIC</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="idType"
                            value="Passport"
                            //checked={formData.idType === "Passport"}
                            //onChange={handleInputChange}
                            className="text-indigo-500 focus:ring-indigo-400"
                        />
                        <span>Passport</span>
                    </label>
                </div>

                <div>
                    <input
                        type="text"
                        name="idNumber"
                        //value={formData.idNumber}
                        //onChange={handleInputChange}
                        placeholder="NIC Number"
                        className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                        required
                    />
                </div>

                <div className="relative">
                    <input
                        type="password"
                        name="password"
                        //value={formData.password}
                        //onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 pr-12 border-gray-300 focus:border-indigo-400"
                        required
                        minLength={8}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </button>
                </div>

                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        //value={formData.confirmPassword}
                        //onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                        required
                    />
                </div>
            </div>

            {isSignupError && (
                <p className="text-red-500 text-center">{isSignupError}</p>
            )}

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    //onClick={() => setStep(3)}
                    className="px-6 py-2 border rounded-full"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 w-[140px] bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                    disabled={isSignupLoading}
                >
                    Next
                </button>
            </div>
        </form>
    );
};
