import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SupplierData {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userAge: string;
  userPassword: string;
  genderPreference: string;
  customAvatarUrl: string;
  userContactNumber: string;
}

interface MusicUsersData {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userAge: string;
  userPassword: string;
  genderPreference: string;
  customAvatarUrl: string;
  userContactNumber: string;
}

const registeredFormSlice = createSlice({
  name: "registeredForm",
  initialState: {
    Suppliers: [] as SupplierData[],
    MusicUser: [] as MusicUsersData[],
  },
  reducers: {
    addSupplier: (state, action: PayloadAction<SupplierData>) => {
      state.Suppliers.push(action.payload);
    },
    addUser: (state, action: PayloadAction<MusicUsersData>) => {
      state.MusicUser.push(action.payload);
    },
  },
});

export const { addSupplier, addUser } = registeredFormSlice.actions;
export default registeredFormSlice.reducer;
