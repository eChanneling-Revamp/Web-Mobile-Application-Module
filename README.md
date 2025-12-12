# eChannelling - Healthcare Appointment Booking Platform

A modern web application for booking medical appointments with doctors across Sri Lanka. Built with Next.js, React, and TypeScript.

## 🌐 Live Demo

**Live Site**: [https://echannelling.vercel.app/](https://echannelling.vercel.app/)

## Tech Stack

-   Next.js 16.0.7
-   React 19.1.0
-   TypeScript 5.9.3
-   Tailwind CSS 4.1.14
-   Redux Toolkit 2.9.0
-   React Redux 9.2.0
-   Axios 1.12.2
-   React Icons 5.5.0
-   Lucide React 0.544.0
-   jsPDF 3.0.3
-   Nodemailer 7.0.11
-   Twilio 5.10.7
-   crypto-js 4.2.0

## Prerequisites

-   Node.js (version 18+)
-   npm or yarn
-   Redis instance (Upstash recommended)
-   SMTP server access (for email OTP)
-   Twilio account (for SMS OTP)

## Installation

```bash
git clone <repository-url>
cd e-channeling
npm install
```

## 📋 Environment Variables

Create a `.env` file in the root of your project and add the following:

```env
# ===========================
# Redis Configuration (Upstash)
# ===========================
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token

# ===========================
# Email Configuration (SMTP)
# ===========================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_USER=your-email@gmail.com

# ===========================
# Twilio Configuration (SMS)
# ===========================
TWILIO_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE=+1234567890

# ===========================
# API Configuration
# ===========================
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
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
-   `/search` - Find Doctors
-   `/profile` - User profile (Protected - requires login)
-   `/booking` - Appointment booking (Protected - requires login)
