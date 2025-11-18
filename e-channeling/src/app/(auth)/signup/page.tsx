'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  requestOtp,
  verifyOtp,
  signup,
  setSignupData,
} from '@/store/auth/authSlice';

import Image from 'next/image';
import Link from 'next/link';

const SignUpPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isOtpLoading,
    isSignupLoading,
    signupData,
  } = useSelector((state: RootState) => state.auth);

  // remove this and add above
  const isOtpVerified = true
  const isSignupError =false
 

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120); // 2 minutes
  const [formData, setFormData] = useState({
    nationality: 'Sri Lankan',
    phoneNumber: '',
    package: '',
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    idType: 'NIC',
    idNumber: '',
    password: '',
    confirmPassword: '',
  });

  const packages = [
    {
      name: 'Free Member',
      price: '0 LKR',
      duration: 'Life time',
      features: [
        'Member loyalty point scheme',
        'Able to view Doctor Channel History',
      ],
    },
    {
      name: 'Premium Member',
      price: '2000 LKR',
      duration: '1 Year',
      features: [
        '30% on ECH Service fee',
        '15% on ECH Service fee',
      ],
    },
  ];

  useEffect(() => {
    // OTP timer countdown
    if (otpTimer > 0 && step === 2) {
      const timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phoneNumber) {
      await dispatch(requestOtp({ phoneNumber: formData.phoneNumber }));
      dispatch(setSignupData({ nationality: formData.nationality, phoneNumber: formData.phoneNumber }));
      setStep(2);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phoneNumber && otp) {
      await dispatch(verifyOtp({ phoneNumber: formData.phoneNumber, otp }));
      if (isOtpVerified) {
        setStep(3);
      }
    }
  };

  const handlePackageSelect = (packageName: string) => {
    setFormData((prev) => ({ ...prev, package: packageName }));
    dispatch(setSignupData({ package: packageName }));
    setStep(4);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const signupPayload = {
      title: formData.title,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      idType: formData.idType as 'NIC' | 'Passport',
      idNumber: formData.idNumber,
      password: formData.password,
      nationality: signupData.nationality || formData.nationality,
      phoneNumber: signupData.phoneNumber || formData.phoneNumber,
      package: signupData.package || formData.package
    };

    if (!signupPayload.nationality || !signupPayload.phoneNumber || !signupPayload.package) {
      alert('Missing required fields');
      return;
    }

    await dispatch(signup(signupPayload));
    if (!isSignupError){
        setStep(5);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4 text-center">Set Nationality</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm">Nationality *</label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                    required
                  >
                    <option value="Sri Lankan">Sri Lankan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Phone Number *</label>
                  <div className="flex">
                    <span className="px-3 py-3 border-2 border-r-0 rounded-l-full bg-gray-50">+94</span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Ex: 711234567"
                      className="flex-1 px-4 py-3 border-2 rounded-r-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" className="px-6 py-2 border rounded-full">
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2 w-[140px] bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
              >
                Next
              </button>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4 text-center">Verify Mobile Number</h2>
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="font-medium">OTP Verification</p>
                  <p className="text-sm text-gray-600 mt-2">
                    We have shared the OTP with the registered mobile number / email address
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  {Array(6).fill(0).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.match(/^[0-9]$/)) {
                          const newOtp = otp.split('');
                          newOtp[i] = value;
                          setOtp(newOtp.join(''));
                          if (i < 5 && value) {
                            const nextInput = e.target.nextElementSibling as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          }
                        }
                      }}
                      className="w-12 h-12 text-center border-2 rounded-lg focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                    />
                  ))}
                </div>
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    OTP Expires in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </p>
                  <p className="text-sm">
                    Didn&apos;t receive an OTP?{' '}
                    <button
                      type="button"
                      onClick={() => otpTimer === 0 && setOtpTimer(120)}
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                      disabled={otpTimer > 0}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 border rounded-full"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-2 w-[140px] bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                disabled={isOtpLoading || otp.length !== 6}
              >
                Next
              </button>
            </div>
          </form>
        );

case 3:
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-bold text-center">Select Package</h2>

      {/* Two equal cards side-by-side on md+, stacked on small screens */}
      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            onClick={() => handlePackageSelect(pkg.name)}
            className={`relative cursor-pointer transition-all rounded-xl border bg-white p-6 min-h-[300px] flex flex-col justify-between ${
              formData.package === pkg.name
                ? 'border-[#4B5BDA] shadow-md'
                : 'border-gray-300 hover:shadow-sm'
            }`}
          >
            {/* top row with icon */}
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                pkg.name === 'Free Member' ? 'bg-[#E8F4FE]' : 'bg-[#F1FFE9]'
              }`}>
                {pkg.name === 'Free Member' ? (
                  <span className="text-[#4B5BDA] text-xl">★</span>
                ) : (
                  <span className="text-[#75B53B] text-xl">👑</span>
                )}
              </div>

              {/* Selected pill positioned top-right */}
              {formData.package === pkg.name && (
                <span className="absolute top-3 right-3 text-xs bg-[#4B5BDA] text-white px-3 py-1 rounded-full">
                  Selected
                </span>
              )}
            </div>

            {/* center: title + price */}
            <div className="flex-1 flex flex-col justify-center items-start">
              <h3 className="font-medium">{pkg.name}</h3>
              <p className="text-2xl font-extrabold mt-2">{pkg.price}</p>
              <p className="text-sm text-gray-500 mt-2">{pkg.duration}</p>
            </div>

            {/* bottom: features */}
            <ul className="space-y-2 text-sm text-gray-700 mt-4">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center text-sm">
        <Link href="/membership-details" className="text-blue-600 hover:text-blue-700 underline">
          To view more info regarding eChannelling membership and benefits visit Membership Details
        </Link>
      </div>

      <div className="flex justify-end space-x-4 pt-2">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-6 py-2 border rounded-full transition-all hover:shadow-md active:scale-95"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => formData.package && setStep(4)}
          className="px-6 py-2 w-[140px] bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
          disabled={!formData.package}
        >
          Next
        </button>
      </div>
    </div>
  );


      case 4:
        // added extra spacing so inputs don't feel cramped
        return (
          <form onSubmit={handleFinalSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                  required
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-full">
                <input
                  type="tel"
                  value={formData.phoneNumber}
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
                    checked={formData.idType === 'NIC'}
                    onChange={handleInputChange}
                    className="text-indigo-500 focus:ring-indigo-400"
                  />
                  <span>NIC</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="idType"
                    value="Passport"
                    checked={formData.idType === 'Passport'}
                    onChange={handleInputChange}
                    className="text-indigo-500 focus:ring-indigo-400"
                  />
                  <span>Passport</span>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="NIC Number"
                  className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 pr-12 border-gray-300 focus:border-indigo-400"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border-2 rounded-full focus:outline-none transition-colors placeholder:text-gray-500 border-gray-300 focus:border-indigo-400"
                  required
                />
              </div>
            </div>

            {isSignupError && <p className="text-red-500 text-center">{isSignupError}</p>}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setStep(3)}
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

case 5:
  return (
    <div className="text-center space-y-8">
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
        Congratulations! You have successfully registered as a Free Member!
      </h2>

      <div className="flex justify-center space-x-4 pt-2">
        <button
          onClick={() => setStep(4)}
          className="px-6 py-2 border rounded-full transition-all hover:shadow-md active:scale-95"
        >
          Previous
        </button>

        <Link href="/login">
          <button
            className="px-6 py-2 w-[140px] bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
          >
            Done
          </button>
        </Link>
      </div>
    </div>
  );


      default:
        return null;
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-gray-50 flex flex-col items-center justify-center p-4">

      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.jpg"
          alt="eChannelling"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>

      {/* Main card - same size tokens as sign-in (max-w-md) */}
<div
  className={`bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg relative overflow-hidden space-y-6 mb-20 ${
    step === 5 ? 'min-h-[500px] justify-center' : 'min-h-[680px] flex flex-col justify-between'
  }`}
>

        <div className="relative z-10 ">
          <h1 className="text-2xl font-bold text-center mb-4 ">Sign Up</h1>
          <p className="text-gray-600 text-center mb-6 text-sm">Hello there! Let&apos;s create your account.</p>

          {/* Progress steps - circle size preserved (h-8 w-8) */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    stepNumber <= step ? 'bg-blue-600 text-white' : 'border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {stepNumber < step ? '✓' : stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`w-8 h-0.5 ${stepNumber < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Content or success card replacement */}
          <div className="space-y-6">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
