import { configureStore } from "@reduxjs/toolkit";
import userLoginReducer from "../redux/reducers/UserLoginSlice";
import registeredReducer from "./reducers/RegisteredFormSlice";
import contractReducer from "../redux/reducers/ContractSlice";

const store = configureStore({
  reducer: {
    userLogin: userLoginReducer,
    registered: registeredReducer,
    contract: contractReducer,
  },
});

export default store;
