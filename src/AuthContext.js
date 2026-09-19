import React, {
  createContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext();

// =====================================================
// GET USER FROM LOCAL STORAGE SAFELY
// =====================================================

const getStoredUser = () => {
  try {
    const savedUser =
      localStorage.getItem("currentUser");

    if (
      !savedUser ||
      savedUser === "undefined" ||
      savedUser === "null"
    ) {
      return null;
    }

    const user = JSON.parse(savedUser);

    if (
      !user ||
      typeof user !== "object"
    ) {
      return null;
    }

    return user;

  } catch (error) {

    console.error(
      "User Parse Error:",
      error
    );

    return null;
  }
};

// =====================================================
// AUTH PROVIDER
// =====================================================

const AuthProvider = ({ children }) => {

  // ===================================================
  // INITIAL USER
  // ===================================================

  const [currentUser, setCurrentUser] =
    useState(() => getStoredUser());

  const [isAuth, setIsAuth] =
    useState(() => {
      const user = getStoredUser();

      return !!user;
    });

  // ===================================================
  // CHECK AUTH
  // ===================================================

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

      const data =
        await response.json();

      console.log(
        "CHECK AUTH RESPONSE:",
        data
      );

      // ===============================================
      // BACKEND AUTH SUCCESS
      // ===============================================

      if (
        data?.success &&
        data?.user
      ) {

        console.log(
          "CHECK AUTH USER:",
          data.user
        );

        setCurrentUser(
          data.user
        );

        setIsAuth(true);

        localStorage.setItem(
          "currentUser",
          JSON.stringify(
            data.user
          )
        );

        return data.user;
      }

      // ===============================================
      // BACKEND AUTH FAILED
      // USE LOCAL STORAGE USER
      // ===============================================

      const storedUser =
        getStoredUser();

      if (storedUser) {

        console.log(
          "Using localStorage user:",
          storedUser
        );

        setCurrentUser(
          storedUser
        );

        setIsAuth(true);

        return storedUser;
      }

      // ===============================================
      // NO USER
      // ===============================================

      setCurrentUser(null);

      setIsAuth(false);

      return null;

    } catch (error) {

      console.error(
        "Check auth error:",
        error
      );

      // ===============================================
      // IMPORTANT
      // DO NOT REMOVE USER FROM LOCAL STORAGE
      // ===============================================

      const storedUser =
        getStoredUser();

      if (storedUser) {

        console.log(
          "Check-auth failed. Using stored user:",
          storedUser
        );

        setCurrentUser(
          storedUser
        );

        setIsAuth(true);

        return storedUser;
      }

      setCurrentUser(null);

      setIsAuth(false);

      return null;
    }
  };

  // ===================================================
  // INITIAL AUTH CHECK
  // ===================================================

  useEffect(() => {

    checkAuth();

  }, []);

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {

    localStorage.removeItem(
      "currentUser"
    );

    setCurrentUser(null);

    setIsAuth(false);
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (

    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuth,
        setIsAuth,
        checkAuth,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};

export default AuthProvider;