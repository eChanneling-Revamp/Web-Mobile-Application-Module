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
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{appointment.doctorName}</h3>
              <p className="text-gray-600">{appointment.specialty}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                {appointment.date}
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                appointment.type === "In-Person" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-blue-100 text-blue-800"
              }`}>
                {appointment.type === "Telehealth" && <Video className="w-3 h-3 mr-1" />}
                {appointment.type}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {appointment.time}
              </div>
              {appointment.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {appointment.location}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {appointment.actions.canJoin && (
                <button 
                  onClick={() => onJoinConsultation(appointment)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Join Consultation
                </button>
              )}
              <button 
                onClick={handleViewDetails}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {showDetails ? 'Hide Details' : 'View Details'}
              </button>
              {appointment.actions.canCancel && (
                <button 
                  onClick={() => onCancel(appointment)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              {appointment.actions.canReschedule && (
                <button 
                  onClick={() => onReschedule(appointment)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Reschedule
                </button>
              )}
            </div>
          </div>

          {/* Details Section */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Appointment Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
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
                <div className="col-span-2">
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
    </div>
  );
};

export default AppointmentCard;