import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../configs/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [signUpStatus, setSignUpStatus] = useState(false);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSignUpStatus(user ? true : false);
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const values = {
    user,
    logout,
    setSignUpStatus,
    signUpStatus,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
