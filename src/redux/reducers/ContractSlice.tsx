import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContractState {
  contracts: any[]; 
  selectedEvent: any;
}

const initialState: ContractState = {
  contracts: [],
  selectedEvent: null,
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    addContract: (state, action: PayloadAction<any>) => {
      state.contracts.push(action.payload);
    },
    setSelectedEvent: (state, action: PayloadAction<any>) => {
      state.selectedEvent = action.payload;
    },
  },
});

export const { addContract, setSelectedEvent } = contractSlice.actions;
export default contractSlice.reducer;
