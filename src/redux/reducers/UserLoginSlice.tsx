import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../../model/UserData";
import { SupplierData } from "../../model/SupplierData";

interface UserLoginState {
  user: UserData | SupplierData | null;
  isLoggedOut: boolean;
  hasShownWelcomeMessage: boolean;
}

const initialState: UserLoginState = {
  user: null,
  isLoggedOut: false,
  hasShownWelcomeMessage: false, 
};

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | SupplierData | null>) => {
      state.user = action.payload;
      state.isLoggedOut = false; // Al establecer un nuevo usuario, reseteamos el estado de cierre de sesión
      state.hasShownWelcomeMessage = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedOut = true;
    },
    setShowWelcomeMessage: (state, action: PayloadAction<boolean>) => {
      state.hasShownWelcomeMessage = action.payload;
    },
  },
});

export const { setUser, logoutUser, setShowWelcomeMessage } = userLoginSlice.actions;
export default userLoginSlice.reducer;
