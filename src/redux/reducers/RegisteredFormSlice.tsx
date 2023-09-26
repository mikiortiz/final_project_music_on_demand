import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../model/UserData";
import { SupplierData } from "../model/SupplierData";

const registeredFormSlice = createSlice({
  name: "registeredForm",
  initialState: {
    Suppliers: [] as SupplierData[],
    MusicUsers: [] as UserData[],
  },
  reducers: {
    addSupplier: (state, action: PayloadAction<SupplierData>) => {
      state.Suppliers.push(action.payload);
    },
    addUser: (state, action: PayloadAction<UserData>) => {
      state.MusicUsers.push(action.payload);
    },
  },
});

export const { addSupplier, addUser } = registeredFormSlice.actions;
export default registeredFormSlice.reducer;