import { SupplierData as Supplier } from "./SupplierData";
import { UserData as MusicUser } from "./UserData";

interface RootState {
  registered: {
    Suppliers: Supplier[];
    MusicUsers: MusicUser[];
  };
  // Otros estados si los tienes
}

export default RootState;
