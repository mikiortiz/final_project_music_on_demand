import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../model/UserData";
import { SupplierData } from "../model/SupplierData";

interface UserLoginState {
  user: UserData | SupplierData | null;
}

const initialState: UserLoginState = {
  user: null,
};

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | SupplierData | null>) => {
      state.user = action.payload;
      // Agrega el campo selectedGenres al usuario cuando se establece
      if (state.user) {
        state.user.selectedGenres = [];
      }
    },
    setSelectedGenres: (state, action: PayloadAction<string[]>) => {
      // Establece los géneros seleccionados en el usuario
      if (state.user) {
        state.user.selectedGenres = action.payload;
      }
    },
  },
});

export const { setUser, setSelectedGenres } = userLoginSlice.actions;
export default userLoginSlice.reducer;
