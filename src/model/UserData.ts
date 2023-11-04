import { Area } from "./AreaType";

export interface UserData {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userAge: string;
  userPassword: string;
  customUserAvatarUrl: string;
  userContactNumber: string;
  userType?: string;
  selectedGenres?: string[];
  area?: Area[];
}
