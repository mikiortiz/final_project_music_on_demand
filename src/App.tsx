import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSupplierRegistration from "./components/UserSupplierRegistration";
import SupplierWelcome from "./components/SupplierWelcome";

function App() {
  return (
    <Router>
      <div>
       
        <Routes>
          {/* Otras rutas */}
          <Route path="/" element={ <UserSupplierRegistration />}/>
          <Route path="/supplierwelcome" element={<SupplierWelcome />} />
          {/* Otras rutas */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
