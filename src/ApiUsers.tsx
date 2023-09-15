import { BrowserRouter as Router } from "react-router-dom";
import UserSupplierRegistration from "./components/UserSupplierRegistration";

function App() {
  return (
    <Router>
      <div>
        <UserSupplierRegistration />
      </div>
    </Router>
  );
}

export default App;
