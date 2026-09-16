import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/check-auth",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {

        console.log("CHECK AUTH USER", data.user);
        setCurrentUser(data.user);
        setIsAuth(true);

        localStorage.setItem(
          "currentUser",
          JSON.stringify(data.user)
        );
      } else {
        setCurrentUser(null);
        setIsAuth(false);
        localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.log("Check auth error:", error);
      setCurrentUser(null);
      setIsAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuth,
        setIsAuth,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;