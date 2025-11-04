"use client";
import React, { useState } from 'react';
import { Calendar, MapPin, Video } from 'lucide-react';
import { Appointment } from './types';

interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onJoinConsultation: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewDetails,
  onJoinConsultation,
  onCancel,
  onReschedule,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(!showDetails);
    onViewDetails(appointment);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">{appointment.doctorName}</h3>
            <p className="text-sm text-gray-600">{appointment.specialty}</p>
          </div>
          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
            <div className="flex items-center text-gray-500 text-xs md:text-sm">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {appointment.date}
            </div>
            <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium ${
              appointment.type === "In-Person" 
                ? "bg-green-100 text-green-800" 
                : "bg-blue-100 text-blue-800"
            }`}>
              {appointment.type === "Telehealth" && <Video className="w-3 h-3 mr-1" />}
              {appointment.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {appointment.time}
            </div>
            {appointment.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="line-clamp-1">{appointment.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 border-t border-gray-100">
          {appointment.actions.canJoin && (
            <button 
              onClick={() => onJoinConsultation(appointment)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Join Consultation
            </button>
          )}
          <button 
            onClick={handleViewDetails}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
          {appointment.actions.canCancel && (
            <button 
              onClick={() => onCancel(appointment)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
          )}
          {appointment.actions.canReschedule && (
            <button 
              onClick={() => onReschedule(appointment)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Reschedule
            </button>
          )}
        </div>

        {showDetails && (
          <div className="mt-2 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Appointment Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
              <div>
                <span className="font-medium">Doctor:</span> {appointment.doctorName}
              </div>
              <div>
                <span className="font-medium">Specialty:</span> {appointment.specialty}
              </div>
              <div>
                <span className="font-medium">Date:</span> {appointment.date}
              </div>
              <div>
                <span className="font-medium">Time:</span> {appointment.time}
              </div>
              <div>
                <span className="font-medium">Type:</span> {appointment.type}
              </div>
              {appointment.location && (
                <div>
                  <span className="font-medium">Location:</span> {appointment.location}
                </div>
              )}
              <div className="sm:col-span-2">
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  appointment.status === 'upcoming' 
                    ? 'bg-green-100 text-green-800' 
                    : appointment.status === 'past'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;