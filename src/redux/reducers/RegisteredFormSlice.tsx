import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupplierData } from "../../model/SupplierData";
import { UserData } from "../../model/UserData";

interface RegisteredFormState {
  DjsUsers: SupplierData[];
  MusicUsers: UserData[];
}

const initialState: RegisteredFormState = {
  DjsUsers: [
    {
      userEmail: "ismael.Gonzales@example.com",
      userFirstName: "Ismael",
      userLastName: "Gonzales",
      userAge: "34",
      userPassword: "1111",
      customAvatarUrl: "https://randomuser.me/api/portraits/men/94.jpg",
      userContactNumber: "(474)-691-9215",
      selectedGenres: [],
    },
    {
      userEmail: "Miguel.Ortiz@example.com",
      userFirstName: "Miguel",
      userLastName: "Ortiz",
      userAge: "33",
      userPassword: "1111",
      customAvatarUrl: "https://randomuser.me/api/portraits/men/57.jpg",
      userContactNumber: "(02622)-517454",
      selectedGenres: [],
    },
  ],
  MusicUsers: [
    {
      userEmail: "Tiago.Gonzales@example.com",
      userFirstName: "Tiago",
      userLastName: "Gonzales",
      userAge: "18",
      userPassword: "1111",
      customUserAvatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      userContactNumber: "(068) Y09-7656",
      selectedGenres: [],
    },
    {
      userEmail: "Gisela.Leites@example.com",
      userFirstName: "Gisela",
      userLastName: "Leites",
      userAge: "34",
      userPassword: "1111",
      customUserAvatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      userContactNumber: "(44) 8504-6472",
      selectedGenres: [],
    },
  ],
};

const registeredFormSlice = createSlice({
  name: "registeredForm",
  initialState,
  reducers: {
    addSupplier: (state, action: PayloadAction<SupplierData>) => {
      const supplier: SupplierData = {
        ...action.payload,
        selectedGenres: action.payload.selectedGenres || [],
      };
      state.DjsUsers.push(supplier);
    },
    addUser: (state, action: PayloadAction<UserData>) => {
      state.MusicUsers.push(action.payload);
    },
    setSelectedGenres: (
      state,
      action: PayloadAction<{ email: string; genres: string[] }>
    ) => {
      const { email, genres } = action.payload;
      const user = state.DjsUsers.find((user) => user.userEmail === email);
      if (user) {
        user.selectedGenres = genres;
      }
    },
  },
});

export const { addSupplier, addUser, setSelectedGenres } =
  registeredFormSlice.actions;
export default registeredFormSlice.reducer;
