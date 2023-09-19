import { configureStore } from "@reduxjs/toolkit";
import registeredReducer from "./reducers/RegisteredFormSlice"; // Importa el slice con el nuevo nombre

const store = configureStore({
  reducer: {
    registered: registeredReducer, // Usa el slice con el nuevo nombre "registered"
  },
});

export default store;
