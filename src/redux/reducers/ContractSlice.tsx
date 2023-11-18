import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContractState {
  contracts: any[];
  selectedEvent: any;
}

const initialState: ContractState = {
  contracts: [],
  selectedEvent: null,
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    addContract: (state, action: PayloadAction<any>) => {
      const userEmail = action.payload.userEmail;
      state.contracts.push({ ...action.payload, userEmail });
    },
    setSelectedEvent: (state, action: PayloadAction<any>) => {
      state.selectedEvent = action.payload;
    },
    deleteContract: (state, action: PayloadAction<any>) => {
      const contractIndex = state.contracts.findIndex(
        (contract) => contract.email === action.payload.email
      );
      if (contractIndex !== -1) {
        state.contracts.splice(contractIndex, 1);
      }
    },
  },
});

export const { addContract, setSelectedEvent, deleteContract } =
  contractSlice.actions;
export default contractSlice.reducer;
