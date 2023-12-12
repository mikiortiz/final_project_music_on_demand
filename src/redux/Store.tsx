import { configureStore } from "@reduxjs/toolkit";
import registeredReducer from "./reducers/RegisteredFormSlice";
import contractReducer from "../redux/reducers/ContractSlice";

const store = configureStore({
  reducer: {
    registered: registeredReducer,
    contract: contractReducer,
  },
});

export default store;
