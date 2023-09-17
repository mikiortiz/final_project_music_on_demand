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

const supplierFormSlice = createSlice({
  name: "supplierForm",
  initialState: {
    suppliers: [] as SupplierData[],
  },
  reducers: {
    addSupplier: (state, action: PayloadAction<SupplierData>) => {
      state.suppliers.push(action.payload);
    },
  },
});

export const { addSupplier } = supplierFormSlice.actions;
export default supplierFormSlice.reducer;
