import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./Login/Login.js";
import CreateAccount from "./Login/CreateAccount.js";
import Employee from "./Pages/EmployeeDashbord.js";
import Header from "./Header";
import Home from "./Home";
import Admin from "./Pages/AdminDashbord.js";
import Notifications from "./Pages/Notification.js";
import CreateJob from "./Pages/CreateJob.js";

const AppRoutes = () => {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/create-account"
          element={<CreateAccount />}
        />

        <Route
          path="/employee"
          element={<Employee />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/create-job"
          element={<CreateJob />}
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;