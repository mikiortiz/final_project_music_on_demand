import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSupplierRegistration from "./components/UserSupplierRegistration";
import SupplierWelcome from "./components/SupplierWelcome";
import UserWelcome from "./components/UserWelcome";
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
    <Router>
      <div>
       
        <Routes>
          {/* Otras rutas */}
          <Route path="/" element={ <UserSupplierRegistration />}/>
          <Route path="/supplierwelcome" element={<SupplierWelcome />} />
          <Route path="/userwelcome" element={<UserWelcome />} />
          {/* Otras rutas */}
        </Routes>
      </div>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
