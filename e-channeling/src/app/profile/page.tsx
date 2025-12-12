"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/profile/Sidebar';
import AppointmentTabs from '@/components/profile/AppointmentTabs';
import AppointmentCard from '@/components/profile/AppointmentCard';
import { Appointment , User } from '@/components/profile/types';

const UserProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("Appointments");
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  const user: User = {
    name: "Priva Jayawardena",
    email: "priya.j@gmail.com",
  };

  const appointments: Appointment[] = [
    {
      id: "1",
      doctorName: "Dr. Samantha Perera",
      specialty: "Cardiologist",
      date: "6/15/2023",
      type: "In-Person",
      time: "10:00 AM",
      location: "National Hospital, Colombo",
      status: "upcoming",
      actions: {
        canJoin: false,
        canCancel: true,
        canReschedule: true
      }
    },
    {
      id: "2",
      doctorName: "Dr. Arjun Rajapakse",
      specialty: "Dermatologist",
      date: "6/20/2023",
      type: "Telehealth",
      time: "2:30 PM",
      status: "upcoming",
      actions: {
        canJoin: true,
        canCancel: true,
        canReschedule: true
      }
    },
    {
      id: "3",
      doctorName: "Dr. Kamal Silva",
      specialty: "General Physician",
      date: "5/10/2023",
      type: "In-Person",
      time: "11:00 AM",
      location: "City Medical Center",
      status: "past",
      actions: {
        canJoin: false,
        canCancel: false,
        canReschedule: false
      }
    },
    {
      id: "4",
      doctorName: "Dr. Nisha Fernando",
      specialty: "Pediatrician",
      date: "4/22/2023",
      type: "Telehealth",
      time: "3:00 PM",
      status: "cancelled",
      actions: {
        canJoin: false,
        canCancel: false,
        canReschedule: false
      }
    }
  ];

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(apt => apt.status === activeTab);

  const appointmentCounts = {
    upcoming: appointments.filter(apt => apt.status === "upcoming").length,
    past: appointments.filter(apt => apt.status === "past").length,
    cancelled: appointments.filter(apt => apt.status === "cancelled").length,
  };

  // Event handlers for appointment actions
  const handleViewDetails = (appointment: Appointment) => {
    console.log('View details for:', appointment.doctorName);
  };

  const handleJoinConsultation = (appointment: Appointment) => {
    alert(`Joining consultation with ${appointment.doctorName}`);
  };

  const handleCancel = (appointment: Appointment) => {
    if (confirm(`Are you sure you want to cancel your appointment with ${appointment.doctorName}?`)) {
      alert(`Appointment with ${appointment.doctorName} has been cancelled.`);
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    alert(`Redirecting to reschedule appointment with ${appointment.doctorName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Mobile: Sidebar dropdown */}
          <div className="lg:hidden">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <div>
                    <select 
                      value={activeSection}
                      onChange={(e) => setActiveSection(e.target.value)}
                      className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                    >
                      <option value="Appointments">Appointments</option>
                      <option value="Health Records">Health Records</option>
                      <option value="Payments & Refunds">Payments & Refunds</option>
                      <option value="Membership">Membership</option>
                      <option value="Notifications">Notifications</option>
                      <option value="Settings">Settings</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Sidebar */}
          <div className="hidden lg:block">
            <Sidebar 
              user={user} 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 md:mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your medical appointments</p>
            </div>

            <AppointmentTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={appointmentCounts}
            />

            {filteredAppointments.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewDetails={handleViewDetails}
                    onJoinConsultation={handleJoinConsultation}
                    onCancel={handleCancel}
                    onReschedule={handleReschedule}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <svg 
                    className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mb-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                    No {activeTab} appointments
                  </h3>
                  <p className="text-gray-500 text-sm">
                    You don&apos;t have any {activeTab} appointments at the moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;