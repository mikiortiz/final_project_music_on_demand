import { EventTypeContract } from "./EventTypes";
import { SupplierData as Supplier, SupplierData } from "./SupplierData";
import { UserData as MusicUser } from "./UserData";

// Definicón, tipos de usuarios
type UserType = "user" | "supplier";

export interface RootState {
  registered: {
    DjsUsers: Supplier[];
    MusicUsers: MusicUser[];
  };
  userLogin: {
    hasShownWelcomeMessage: any;
    user: any;
    userData: MusicUser | Supplier | null;
    userType: UserType | null;
  };
  contract: {
    selectedDj: SupplierData | null;
    selectedEvent: EventTypeContract | null;
    contracts: any[];
  };
}
