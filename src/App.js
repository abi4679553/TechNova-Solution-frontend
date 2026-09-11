import Header from "./components/Header";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";

import Login from "./components/Login/Login.js";
import CreateAccount from "./components/Login/CreateAccount.js";

import Employee from "./components/Employees";
import JobDetails from "./components/JobDetails";
import ApplyJob from "./components/ApplyJob";
import AdminApplications from "./components/AdminApplications";

function App() {
  return (
    <div className="App">

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/admin-applications" element={<AdminApplications />} />
      </Routes>

    </div>
  );
}

export default App;