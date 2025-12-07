import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Appointment, User } from "@/components/profile/types";

interface ProfileState {
    user: User;
    appointments: Appointment[];
    activeTab: string;
    activeSection: string;
}

const initialState: ProfileState = {
    user: {
        name: "Priva Jayawardena",
        email: "priya.j@gmail.com",
    },
    appointments: [
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
                canReschedule: true,
            },
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
                canReschedule: true,
            },
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
                canReschedule: false,
            },
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
                canReschedule: false,
            },
        },
    ],
    activeTab: "upcoming",
    activeSection: "Appointments",
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        },
        setActiveSection: (state, action: PayloadAction<string>) => {
            state.activeSection = action.payload;
        },
        cancelAppointment: (state, action: PayloadAction<string>) => {
            const appointment = state.appointments.find(
                (apt) => apt.id === action.payload
            );
            if (appointment) {
                appointment.status = "cancelled";
                appointment.actions.canJoin = false;
                appointment.actions.canCancel = false;
                appointment.actions.canReschedule = false;
            }
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            state.user = { ...state.user, ...action.payload };
        },
        addAppointment: (state, action: PayloadAction<Appointment>) => {
            state.appointments.push(action.payload);
        },
    },
});

export const {
    setActiveTab,
    setActiveSection,
    cancelAppointment,
    updateUser,
    addAppointment,
} = profileSlice.actions;

export default profileSlice.reducer;
