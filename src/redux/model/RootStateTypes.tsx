import { SupplierData as Supplier } from "./SupplierData";
import { UserData as MusicUser } from "./UserData";

type UserType = "user" | "supplier"; // Define los tipos de usuario aquí

interface RootState {
  registered: {
    Suppliers: Supplier[];
    MusicUsers: MusicUser[];
  };
  userLogin: {
    user: any;
    userData: MusicUser | Supplier | null; // Define el tipo de usuario aquí
    userType: UserType | null; // Define el tipo de usuario aquí
  };
  // Otros estados si los tienes
}

export default RootState;
