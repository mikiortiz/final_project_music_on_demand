import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSupplierRegistration from "./components/UserSupplierRegistration";
import SupplierWelcome from "./components/djsusers/SupplierWelcome";
import UserWelcome from "./components/musicusers/UserWelcome";
import { SnackbarProvider } from "notistack";
import TypesEvents from "./components/djsusers/TypesEvents";
import PriceConfigurationEvents from "./components/djsusers/PriceConfigurationEvents";
import DjsArea from "./components/djsusers/DjsAreas";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<UserSupplierRegistration />} />
            <Route path="/supplierwelcome" element={<SupplierWelcome />} />
            <Route path="/userwelcome" element={<UserWelcome />} />
            <Route path="/TypesEvents" element={<TypesEvents />} />
            <Route
              path="/PriceConfigurationEvents"
              element={<PriceConfigurationEvents />}
            />
            <Route path="/DjsArea" element={<DjsArea />} />
          </Routes>
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
