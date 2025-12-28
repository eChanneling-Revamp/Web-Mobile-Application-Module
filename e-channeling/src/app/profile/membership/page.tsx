"use client";
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function MembershipPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Membership</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Choose your membership plan</p>
      </div>

      {/* Membership Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        
        {/* Free Member Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Free Member</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">0 LKR</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-600">Life time</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex-grow">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Member loyalty point scheme</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Able to view Doctor Channel History</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              disabled
              className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>
        </div>

        {/* Premium Member Card */}
        <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-6 flex flex-col relative">
          {/* Popular Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Recommended
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Premium Member</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">2000 LKR</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-600">1 Year</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex-grow">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">30% on ECH Service fee</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">15% on ECH Service fee</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-6xl">
        <p className="text-center text-gray-700">
          To view more info regarding eChanneling membership and benefits visit{' '}
          <a href="/membership-details" className="text-blue-600 hover:text-blue-800 font-medium">
            Membership Details
          </a>
        </p>
      </div>
    </div>
  );
}