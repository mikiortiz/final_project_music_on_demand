export interface Area {
  name: string;
  lat: string;
  lng: string;
  radius: number;
}

export interface Event {
  eventName: string;
  price: number;
  hours: string;
}

export interface SupplierData {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userAge: string;
  userPassword: string;
  customAvatarUrl: string;
  userContactNumber: string;
  userType?: string;
  selectedGenres?: string[];
  selectedEvents?: Event[]; // Ahora selectedEvents es un arreglo de objetos de tipo Event
  areas?: Area[];
}
