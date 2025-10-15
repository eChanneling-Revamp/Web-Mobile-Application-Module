import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "@/store/doctor/doctorSlice";
import searchReducer from "@/store/search/searchSlice";

export const store = configureStore({
    reducer: {
        doctor: doctorReducer,
        search: searchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
