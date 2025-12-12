import { Suspense } from "react";
import Booking from "./Booking";

// recreate the booking page
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Booking />
    </Suspense>
  );
}
