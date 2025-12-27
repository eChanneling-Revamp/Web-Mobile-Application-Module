// app/profile/layout.tsx
import { ReactNode } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <ProfileSidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4 bg-white rounded-lg shadow-md p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}