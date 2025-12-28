// src/app/profile/page.tsx
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  // Redirect to appointments by default
  redirect('/profile/appoinments');
  
  return null; // This won't be rendered due to redirect
}