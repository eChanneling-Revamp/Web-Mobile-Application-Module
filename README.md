# eChannelling - Healthcare Appointment Booking Platform

A modern web application for booking medical appointments with doctors across Sri Lanka. Built with Next.js, React, and TypeScript.

## 🌐 Live Demo

**Live Site**: [https://echannelling.vercel.app/](https://echannelling.vercel.app/)


## Tech Stack

-   Next.js 15.5.4
-   React 19.1.0
-   TypeScript 5.9.3
-   Tailwind CSS 4.1.14
-   Redux Toolkit 2.9.0
-   React Redux 9.2.0
-   Axios 1.12.2
-   React Icons 5.5.0
-   Lucide React 0.544.0
-   jsPDF 3.0.3

## Prerequisites

-   Node.js (version 18+)
-   npm

## Installation

```bash
git clone <repository-url>
cd e-channeling
npm install

```

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npx tsx src/utils/api.ts` - Run single ts file

## Routes
-   `/` - Home page
-   `/login` - Login page (/Email/Phone number+ Password)
-   `/signup` - Registration page (Multi-step with OTP verification)
-   `/forgot-password` - Password recovery initiation
-   `/otp-verification` - OTP verification (for forgot-password)
-   `/new-password` - Set new password (for forgot-password)
-   `/success` - Success confirmation (for forgot-password)
-   `/search` - Find Doctors
-   `/profile` - User profile (Protected - requires login)
-   `/booking` - Appointment booking (Protected - requires login)
