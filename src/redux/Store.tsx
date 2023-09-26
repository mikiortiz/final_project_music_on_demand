import { configureStore } from "@reduxjs/toolkit";
import registeredReducer from "./reducers/RegisteredFormSlice";

const store = configureStore({
  reducer: {
    registered: registeredReducer,
  },
});

export default store;
