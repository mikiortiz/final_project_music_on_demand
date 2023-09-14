import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./reducers/SupplierFormSlice"; // Importa el slice original

const store = configureStore({
  reducer: {
    form: formReducer, // Usa el slice original llamado "form"
  },
});

export default store;
