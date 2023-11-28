import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSupplierRegistration from "./components/UserSupplierRegistration";
import SupplierWelcome from "./components/djsusers/SupplierWelcome";
import UserMapHome from "./components/musicusers/UserMapHome";
import { SnackbarProvider } from "notistack";
import TypesEvents from "./components/djsusers/TypesEvents";
import PriceConfigurationEvents from "./components/djsusers/PriceConfigurationEvents";
import DjsArea from "./components/djsusers/DjsAreas";
import UserWelcome from "./components/musicusers/UserWelcome";
import ContractConfiguration from "./components/musicusers/ContractConfiguration";
import ListContracts from "./components/musicusers/ListContracts";
import ConfigurationPlaylist from "./components/musicusers/ConfigurationPlaylist";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<UserSupplierRegistration />} />
            <Route path="/supplierwelcome" element={<SupplierWelcome />} />
            <Route path="/usermaphome" element={<UserMapHome />} />
            <Route path="/TypesEvents" element={<TypesEvents />} />
            <Route
              path="/PriceConfigurationEvents"
              element={<PriceConfigurationEvents />}
            />
            <Route path="/DjsArea" element={<DjsArea />} />
            <Route path="/userwelcome" element={<UserWelcome />} />
            <Route path="/contractconfiguration" element={<ContractConfiguration />} />
            <Route path="/listcontracts" element={<ListContracts />} />
            <Route path="/configurationplaylist" element={<ConfigurationPlaylist />} />
          </Routes>
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
