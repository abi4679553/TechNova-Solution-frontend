import Header from "./components/Header";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login.js";
import CreateAccount from "./components/Login/CreateAccount.js";
import Employee from "./components/Employees";

import Admin from "./components/Admin.js";

function App() {
  return (
    <div className="App">

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/admin-applications" element={<Admin />} />
      </Routes>

    </div>
  );
}

export default App;