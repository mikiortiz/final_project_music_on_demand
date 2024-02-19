import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

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
      state.contracts.push({
        ...action.payload,
        userEmail,
        selectedSongs: [],
        ContractId: uuidv4(),
      });
    },
    setSelectedEvent: (state, action: PayloadAction<any>) => {
      state.selectedEvent = action.payload;
    },
    addSelectedSong: (state, action: PayloadAction<any>) => {
      const { selectedSong, contractId } = action.payload;
      const contractIndex = state.contracts.findIndex(
        (contract) => contract.ContractId === contractId
      );

      if (contractIndex !== -1) {
        state.contracts[contractIndex] = {
          ...state.contracts[contractIndex],
          selectedSongs: [
            ...state.contracts[contractIndex].selectedSongs,
            selectedSong,
          ],
        };
      } else {
        console.error(
          "No se encontró un contrato para el ID de contrato seleccionado."
        );
      }
    },

    removeSelectedSong: (state, action: PayloadAction<any>) => {
      const { selectedSong, contractId } = action.payload;
      const contractIndex = state.contracts.findIndex(
        (contract) => contract.ContractId === contractId
      );

      if (contractIndex !== -1) {
        const selectedSongs = state.contracts[contractIndex].selectedSongs;
        const updatedSelectedSongs = selectedSongs.filter(
          (song: any) => song.id !== selectedSong.id
        );

        state.contracts[contractIndex] = {
          ...state.contracts[contractIndex],
          selectedSongs: updatedSelectedSongs,
        };
      } else {
        console.error(
          "No se encontró un contrato para el ID de contrato seleccionado."
        );
      }
    },

    deleteContract: (state, action: PayloadAction<any>) => {
      const contractIdToDelete = action.payload.contractId;
      const contractIndex = state.contracts.findIndex(
        (contract) => contract.ContractId === contractIdToDelete
      );
      if (contractIndex !== -1) {
        state.contracts.splice(contractIndex, 1);
      } else {
        console.error(
          "No se encontró un contrato para el ID de contrato seleccionado."
        );
      }
    },
  },
});

export const {
  addContract,
  setSelectedEvent,
  addSelectedSong,
  deleteContract,
  removeSelectedSong,
} = contractSlice.actions;
export default contractSlice.reducer;
