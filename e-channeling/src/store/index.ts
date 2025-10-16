import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "@/store/doctor/doctorSlice";
import authReducer from "@/store/auth/authSlice";
import bookingReducer from "@/store/booking/bookingSlice";
import searchReducer from "@/store/search/searchSlice";

export const store = configureStore({
    reducer: {
        doctor: doctorReducer,
        auth: authReducer,
        booking: bookingReducer,
        search: searchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
