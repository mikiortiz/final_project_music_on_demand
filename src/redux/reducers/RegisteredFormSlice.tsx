import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupplierData, Event } from "../../model/SupplierData";
import { Area } from "../../model/AreaType";
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
      userPassword: "asdasd",
      customAvatarUrl: "https://randomuser.me/api/portraits/men/94.jpg",
      userContactNumber: "(474)-691-9215",
      selectedGenres: [],
      selectedEvents: [],
      areas: [],
    },
    {
      userEmail: "Miguel.Ortiz@example.com",
      userFirstName: "Miguel",
      userLastName: "Ortiz",
      userAge: "33",
      userPassword: "asdasd",
      customAvatarUrl: "https://randomuser.me/api/portraits/men/57.jpg",
      userContactNumber: "(02622)-517454",
      selectedGenres: [],
      selectedEvents: [],
      areas: [],
    },
  ],
  MusicUsers: [
    {
      userEmail: "Tiago.Gonzales@example.com",
      userFirstName: "Tiago",
      userLastName: "Gonzales",
      userAge: "18",
      userPassword: "asdasd",
      customUserAvatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      userContactNumber: "(068) Y09-7656",
      area: [],
    },
    {
      userEmail: "Gisela.Leites@example.com",
      userFirstName: "Gisela",
      userLastName: "Leites",
      userAge: "34",
      userPassword: "asdasd",
      customUserAvatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      userContactNumber: "(44) 8504-6472",
      area: [],
    },
  ],
};

const registeredFormSlice = createSlice({
  name: "registeredForm",
  initialState,
  reducers: {
    addSupplier: (state, action: PayloadAction<SupplierData>) => {
      state.DjsUsers.push(action.payload);
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
    setSelectedEvents: (
      state,
      action: PayloadAction<{ email: string; events: Event[] }>
    ) => {
      const { email, events } = action.payload;
      const user = state.DjsUsers.find((user) => user.userEmail === email);
      if (user) {
        user.selectedEvents = events;
      }
    },
    addArea: (state, action: PayloadAction<{ email: string; area: Area }>) => {
      const { email, area } = action.payload;
      const djUser = state.DjsUsers.find((user) => user.userEmail === email);
      const musicUser = state.MusicUsers.find(
        (user) => user.userEmail === email
      );
      if (djUser && djUser.areas) {
        djUser.areas.push(area);
      }
      if (musicUser && musicUser.area) {
        // Busca el índice del área existente en el array
        const existingAreaIndex = musicUser.area.findIndex(
          (area) => area === area
        );
        if (existingAreaIndex !== -1) {
          // Actualiza solo la latitud o longitud según sea necesario
          if (area.lat !== undefined) {
            musicUser.area[existingAreaIndex].lat = area.lat;
          }
          if (area.lng !== undefined) {
            musicUser.area[existingAreaIndex].lng = area.lng;
          }
        } else {
          // Si el área no existe, agrégala al array
          musicUser.area.push(area);
        }
      }
    },
    removeArea: (
      state,
      action: PayloadAction<{ email: string; area: Area }>
    ) => {
      const { email, area } = action.payload;
      const djUser = state.DjsUsers.find((user) => user.userEmail === email);
      const musicUser = state.MusicUsers.find(
        (user) => user.userEmail === email
      );
      if (djUser && djUser.areas) {
        djUser.areas = djUser.areas.filter(
          (a) => JSON.stringify(a) !== JSON.stringify(area)
        );
      }
      if (musicUser && musicUser.area) {
        musicUser.area = musicUser.area.filter(
          (a) => JSON.stringify(a) !== JSON.stringify(area)
        );
      }
    },
  },
});

export const {
  addSupplier,
  addUser,
  setSelectedGenres,
  setSelectedEvents,
  addArea,
  removeArea,
} = registeredFormSlice.actions;
export default registeredFormSlice.reducer;
