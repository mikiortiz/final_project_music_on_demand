import { SupplierData as Supplier } from "./SupplierData";
import { UserData as MusicUser } from "./UserData";

interface RootState {
  registered: {
    Suppliers: Supplier[];
    MusicUser: MusicUser[];
  };
  // Otros estados si los tienes
}

export default RootState;
