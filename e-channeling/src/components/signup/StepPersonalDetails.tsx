import { AppDispatch, RootState } from "@/store";
import { setSignupData } from "@/store/auth/authSlice";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

interface FormData {
    phone_number: string;
    package: string;
    user_type: "individual" | "corporate";
    title: string;
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    id_type: "nic" | "passport";
    nic_number: string;
    passport_number: string;
    nationality: string;
    password: string;
    confirm_password: string;
    company_name: string;
    employee_id: string;
    age: number;
    gender: string;
}

interface ValidationErrors {
    [key: string]: string;
}

interface StepPackageSelectionProps {
    setStep?: (step: number) => void;
}

// example companies
const COMPANIES = ["Roseth", "Nawaloka", "Ruhuna", "Durdans", "Asiri"];

const TITLES = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof"];

const NATIONALITIES = ["Local", "Foreign"];

const COUNTRY_CODES = [
    { code: "+94", country: "Sri Lanka" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "India" },
];

export const StepPersonalDetails = ({ setStep }: StepPackageSelectionProps) => {
    const { signupData } = useSelector((state: RootState) => state.auth);

    // let isPhoneFromPreviousStep = false;
    // let isEmailFromPreviousStep = false;

    // if (signupData.is_number_verified) {
    //     isPhoneFromPreviousStep = !!(signupData && signupData.phone_number
    //         ? signupData.phone_number.trim().slice(3)
    //         : "");
    // }

    // if (signupData.is_email_verified) {
    //     isEmailFromPreviousStep = !!signupData?.email;
    // }

    const isEmailVerified = signupData.is_email_verified;
    const isPhoneVerified = signupData.is_number_verified;

    const [formData, setFormData] = useState<FormData>({
        phone_number: signupData?.phone_number || "",
        package: signupData?.package || "",
        user_type: signupData?.user_type || "individual",
        title: signupData?.title || "Mr",
        first_name: signupData?.first_name || "",
        last_name: signupData?.last_name || "",
        email: signupData?.email || "",
        country_code: signupData?.country_code || "+94",
        id_type: signupData?.id_type || "nic",
        nic_number: signupData?.nic_number || "",
        passport_number: signupData?.passport_number || "",
        nationality: signupData?.nationality || "Local",
        password: signupData?.password || "",
        confirm_password: signupData?.confirm_password || "",
        company_name: signupData?.company_name || "",
        employee_id: signupData?.employee_id || "",
        age: signupData?.age || 0,
        gender: signupData?.gender || "male",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const dispatch = useDispatch<AppDispatch>();

    const handleUserTypeChange = (type: "individual" | "corporate") => {
        setFormData((prev) => ({
            ...prev,
            user_type: type,
        }));
        setErrors({});
    };

    const handleIdTypeChange = (type: "nic" | "passport") => {
        setFormData((prev) => ({
            ...prev,
            id_type: type,
        }));
        setErrors({});
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.first_name.trim())
            newErrors.first_name = "First name is required";
        if (!formData.last_name.trim())
            newErrors.last_name = "Last name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        //const phoneRegex = /^[0-9]{9,10}$/;
        if (!formData.phone_number) {
            newErrors.phone = "Phone number is required";
        }
        // else if (!phoneRegex.test(formData.phone_number)) {
        //     newErrors.phone = "Please enter a valid phone number";
        // }

        if (formData.user_type === "corporate") {
            if (!formData.company_name)
                newErrors.company_name = "Company name is required";
            if (!formData.employee_id.trim())
                newErrors.employee_id = "Employee number/Member ID is required";
        }

        if (formData.id_type === "nic") {
            const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
            if (!formData.nic_number) {
                newErrors.nic_number = "NIC number is required";
            } else if (!nicRegex.test(formData.nic_number)) {
                newErrors.nic_number = "Please enter a valid NIC number";
            }
        } else {
            if (!formData.passport_number.trim()) {
                newErrors.passport_number = "Passport number is required";
            }
            if (formData.id_type === "passport" && !formData.nationality) {
                newErrors.nationality = "Nationality is required";
            }
        }

        if (!formData.gender) {
            newErrors.gender = "Gender is required";
        }

        if (!formData.age || formData.age <= 0) {
            newErrors.age = "Please enter a valid age";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (formData.password.length > 100) {
            newErrors.password = "Password must be less than 100 characters";
        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
                formData.password
            )
        ) {
            newErrors.password =
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        }

        if (!formData.confirm_password) {
            newErrors.confirm_password = "Please confirm your password";
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        setErrors(newErrors);
        //If there are no errors → returns true
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(
                setSignupData({
                    ...signupData,
                    ...formData,
                })
            );
            if (setStep) {
                setStep(5);
            }
        }
    };

    const handleBack = () => {
        if (setStep) {
            setStep(3);
        }
    };

    // console.log("Form data ", formData);
    // console.log("signupData ", signupData);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-2 ">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-[18px] sm:text-[20px] font-semibold text-gray-800">
                        Personal information
                    </h2>
                    <p className="text-[13px] text-gray-500">
                        Please fill the below form fields
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="user_type"
                            value="individual"
                            checked={formData.user_type === "individual"}
                            onChange={() => handleUserTypeChange("individual")}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm sm:text-base text-gray-700">
                            Individual
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="user_type"
                            value="corporate"
                            checked={formData.user_type === "corporate"}
                            onChange={() => handleUserTypeChange("corporate")}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm sm:text-base text-gray-700">
                            Corporate
                        </span>
                    </label>
                </div>

                {formData.user_type === "corporate" && (
                    <div className="text-sm text-blue-500">
                        Please choose the &apos;Corporate&apos; option only if
                        you are an employee or member of one of the listed
                        companies
                    </div>
                )}

                {/* Corporate Fields */}
                {formData.user_type === "corporate" && (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="space-y-1">
                            <label
                                htmlFor="company_name"
                                className="text-sm text-gray-700"
                            >
                                Company Name
                            </label>
                            <select
                                id="company_name"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.company_name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required={formData.user_type === "corporate"}
                            >
                                <option value="">Select company</option>
                                {COMPANIES.map((company) => (
                                    <option key={company} value={company}>
                                        {company}
                                    </option>
                                ))}
                            </select>
                            {errors.company_name && (
                                <p className="text-xs text-red-500">
                                    {errors.company_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label
                                htmlFor="employee_id"
                                className="text-sm text-gray-700"
                            >
                                Employee Number/Member ID{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="employee_id"
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleInputChange}
                                placeholder="Enter your employee number"
                                className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.employee_id
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required={formData.user_type === "corporate"}
                            />
                            {errors.employee_id && (
                                <p className="text-xs text-red-500">
                                    {errors.employee_id}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 ">
                    <div className="space-y-1 ">
                        <label
                            htmlFor="title"
                            className="text-sm text-gray-700"
                        >
                            Title
                        </label>
                        <select
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`w-full min-w-[80px] px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                errors.title
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        >
                            {TITLES.map((title) => (
                                <option key={title} value={title}>
                                    {title}
                                </option>
                            ))}
                        </select>
                        {errors.title && (
                            <p className="text-xs text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1  w-full">
                        <label
                            htmlFor="first_name"
                            className="text-sm text-gray-700"
                        >
                            First name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                            className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                errors.first_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.first_name && (
                            <p className="text-xs text-red-500">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 w-full">
                        <label
                            htmlFor="last_name"
                            className="text-sm text-gray-700"
                        >
                            Last name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                            className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                errors.last_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.last_name && (
                            <p className="text-xs text-red-500">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-1 flex flex-col md:flex-row  gap-10 ">
                    <div className="w-full space-y-1 ">
                        <label
                            htmlFor="email"
                            className="text-sm text-gray-700"
                        >
                            Email{" "}
                            {isEmailVerified && (
                                <span className="text-gray-500 text-xs">
                                    (verified)
                                </span>
                            )}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            disabled={isEmailVerified}
                            className={`w-full min-w-[280px] px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } ${
                                isEmailVerified
                                    ? "bg-gray-100 cursor-not-allowed text-gray-700"
                                    : ""
                            }`}
                            required
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="w-full space-y-1 ">
                        <label
                            htmlFor="phone_number"
                            className="text-sm text-gray-700"
                        >
                            Number <span className="text-red-500">*</span>{" "}
                            {isPhoneVerified && (
                                <span className="text-gray-500 text-xs">
                                    (verified)
                                </span>
                            )}
                        </label>
                        <div className="flex gap-2">
                            <select
                                name="country_code"
                                value={formData.country_code}
                                onChange={handleInputChange}
                                disabled={isPhoneVerified}
                                className={`w-20 px-2 py-[7px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    isPhoneVerified
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {COUNTRY_CODES.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.code}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                placeholder="EX: 715575983"
                                disabled={isPhoneVerified}
                                className={`flex-1 px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.phone
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } ${
                                    isPhoneVerified
                                        ? "bg-gray-100 cursor-not-allowed text-gray-700"
                                        : ""
                                }`}
                                required
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-xs text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <div className="flex items-center gap-6 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="id_type"
                                    value="nic"
                                    checked={formData.id_type === "nic"}
                                    onChange={() => handleIdTypeChange("nic")}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm sm:text-base text-gray-700">
                                    NIC number
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="id_type"
                                    value="passport"
                                    checked={formData.id_type === "passport"}
                                    onChange={() =>
                                        handleIdTypeChange("passport")
                                    }
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm sm:text-base text-gray-700">
                                    Passport
                                </span>
                            </label>
                        </div>

                        {formData.id_type === "nic" ? (
                            <div className="flex flex-col ">
                                <label
                                    htmlFor="nic_number"
                                    className="text-sm text-gray-700 mb-1"
                                >
                                    NIC Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nic_number"
                                    name="nic_number"
                                    value={formData.nic_number}
                                    onChange={handleInputChange}
                                    placeholder="Enter your NIC"
                                    className={`max-w-[400px] px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                        errors.nic_number
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.nic_number && (
                                    <p className="text-xs text-red-500">
                                        {errors.nic_number}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-4 ">
                                <div className="">
                                    <label
                                        htmlFor="nationality"
                                        className="text-sm text-gray-700"
                                    >
                                        Nationality{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                            errors.nationality
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        required
                                    >
                                        {NATIONALITIES.map((nationality) => (
                                            <option
                                                key={nationality}
                                                value={nationality}
                                            >
                                                {nationality}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.nationality && (
                                        <p className="text-xs text-red-500">
                                            {errors.nationality}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="passport_number"
                                        className="text-sm text-gray-700"
                                    >
                                        Passport number{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="passport_number"
                                        name="passport_number"
                                        value={formData.passport_number}
                                        onChange={handleInputChange}
                                        placeholder="Enter your passport number"
                                        className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                            errors.passport_number
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        required
                                    />
                                    {errors.passport_number && (
                                        <p className="text-xs text-red-500">
                                            {errors.passport_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1 px-3">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                            <div className="space-y-1 flex-1">
                                <label
                                    htmlFor="gender"
                                    className="text-sm text-gray-700"
                                >
                                    Gender{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                        errors.gender
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-xs text-red-500">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1 flex-1">
                                <label
                                    htmlFor="age"
                                    className="text-sm text-gray-700"
                                >
                                    Age <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age || ""}
                                    onChange={handleInputChange}
                                    placeholder="Enter your age"
                                    min="0"
                                    max="150"
                                    className={`w-full px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                        errors.age
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.age && (
                                    <p className="text-xs text-red-500">
                                        {errors.age}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                    <div className="space-y-1">
                        <label
                            htmlFor="password"
                            className="text-sm text-gray-700"
                        >
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-[7px] pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
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
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label
                            htmlFor="confirm_password"
                            className="text-sm text-gray-700"
                        >
                            Confirm Password{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-[7px] pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.confirm_password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
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
                                )}
                            </button>
                        </div>
                        {errors.confirm_password && (
                            <p className="text-xs text-red-500">
                                {errors.confirm_password}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-between gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="w-full sm:w-32 px-4  py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all  hover:bg-gray-800 hover:text-white hover:border-gray-400 hover:shadow-md active:scale-95 cursor-pointer"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 w-full sm:w-32 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};
