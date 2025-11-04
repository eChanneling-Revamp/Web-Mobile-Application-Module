"use client";
import React, { useState } from 'react';
import Sidebar from '@/app/components/profile/Sidebar';
import AppointmentTabs from '@/app/components/profile/AppointmentTabs';
import AppointmentCard from '@/app/components/profile/AppointmentCard';
import { Appointment, User } from '@/app/components/profile/types';

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        user={user} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
            <p className="text-gray-500">Manage your medical appointments</p>
          </div>

          {/* Appointment Tabs */}
          <AppointmentTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={appointmentCounts}
          />

          {/* Appointments List */}
          <div className="space-y-6">
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

          {/* Empty State */}
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {activeTab} appointments found.</p>
            </div>
          )}

          {/* Status Indicators */}
          <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Confirmed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;