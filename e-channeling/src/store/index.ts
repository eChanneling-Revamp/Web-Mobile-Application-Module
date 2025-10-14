import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./booking/bookingSlice";


export const store = configureStore({
    reducer: {
        // add all reducers
        booking: bookingReducer, // ✅ key: sliceName → value: reducer

    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;