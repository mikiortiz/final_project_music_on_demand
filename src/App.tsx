import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSupplierRegistration from "./components/UserSupplierRegistration";
import SupplierWelcome from "./components/SupplierWelcome";
import UserWelcome from "./components/UserWelcome";
import { SnackbarProvider } from "notistack";
import TypesEvents from "./components/TypesEvents";
import PriceConfigurationEvents from "./components/PriceConfigurationEvents";
import DjsArea from "./components/DjsAreas";

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
