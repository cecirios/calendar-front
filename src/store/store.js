import { configureStore } from '@reduxjs/toolkit';
import { uiSlice, CalendarSlice, authSlice } from './';


export const store = configureStore({

    reducer: {
        auth: authSlice.reducer,
        calendar: CalendarSlice.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware ) => getDefaultMiddleware ({
        serializableCheck: false
    })
})