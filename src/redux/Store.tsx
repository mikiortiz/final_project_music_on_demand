import { configureStore } from "@reduxjs/toolkit";
import userLoginReducer from "../redux/reducers/UserLoginSlice"; // Importa el reducer del slice del usuario
import registeredReducer from "./reducers/RegisteredFormSlice";

const store = configureStore({
  reducer: {
    userLogin: userLoginReducer,
    registered: registeredReducer,
  },
});

export default store;
