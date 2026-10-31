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
      const savedUser =
        localStorage.getItem(
          "currentUser"
        );

      // NO USER
      if (!savedUser) {
        console.log(
          "No stored user found"
        );

        setCurrentUser(null);
        setIsAuth(false);

        return null;
      }

      // PARSE USER
      const parsedUser =
        JSON.parse(savedUser);

      // INVALID USER
      if (
        !parsedUser ||
        typeof parsedUser !== "object"
      ) {
        console.log(
          "Invalid stored user"
        );

        localStorage.removeItem(
          "currentUser"
        );

        setCurrentUser(null);
        setIsAuth(false);

        return null;
      }

      // VALID USER
      console.log(
        "CHECK AUTH - USING STORED USER:",
        parsedUser
      );

      setCurrentUser(parsedUser);
      setIsAuth(true);

      return parsedUser;

    } catch (error) {
      console.error(
        "Check auth error:",
        error
      );

      // Keep localStorage user if available
      const storedUser =
        getStoredUser();

      if (storedUser) {
        console.log(
          "Check-auth failed. Using stored user:",
          storedUser
        );

        setCurrentUser(storedUser);
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