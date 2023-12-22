import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { app } from "../configs/firebase";
import { requestPermission } from "../helpers/requestNotificationPermission";
import { db } from "../configs/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [signUpStatus, setSignUpStatus] = useState(false);
  const [token, setToken] = useState("");

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSignUpStatus(user ? true : false);
      setUser(user);
    });

    (async function () {
      const tkn = await requestPermission();

      const tokenColRef = collection(db, "tokens");

      const tokenData = {
        tkn: tkn,
        createdAt: Timestamp.now(),
      };

      await addDoc(tokenColRef, tokenData);
      setToken(tkn);
    })();

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
    token,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
