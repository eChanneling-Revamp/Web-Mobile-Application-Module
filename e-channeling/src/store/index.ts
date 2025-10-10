import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        // add all reducers
    },
});

//TypeScript types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;