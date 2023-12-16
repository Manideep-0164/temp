import { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { Box, Heading, Input, Button, Text } from "@chakra-ui/react";

import { auth, db } from "../configs/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";

const Register = () => {
  const { setSignUpStatus, signUpStatus } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const addUserToDatabase = async (userId, userData) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Signup Success");
        setSignUpStatus(true);
        return;
      }

      const userDataToStore = {
        uid: userId,
        ...userData,
      };
      await addDoc(usersCollectionRef, userDataToStore);
      console.log("Signup Success.");

      setSignUpStatus(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Error adding user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      addUserToDatabase(user.uid, {
        name: name,
        photoURL:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        roles: ["user"],
      });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use.");
        return;
      }
      console.log("Error creating user:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      addUserToDatabase(user.uid, {
        name: user.displayName,
        photoURL: user.photoURL,
        roles: ["user"],
      });
    } catch (error) {
      console.log("Error logging in with google:", error);
    }
  };

  if (signUpStatus) {
    return <Navigate to={"/todo"} />;
  }

  return (
    <Box
      w={"45%"}
      margin={"auto"}
      display={"flex"}
      flexDirection={"column"}
      gap={"5px"}
      p={"20px"}
    >
      <Heading textAlign={"center"}>SignUp</Heading>
      <form onSubmit={handleSubmit}>
        <Box
          maxW="md"
          mx="auto"
          mt="8"
          p="4"
          borderWidth="1px"
          borderRadius="lg"
        >
          <Input
            type="text"
            placeholder="User Name"
            isRequired={true}
            mb="4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Example@gmail.com"
            isRequired={true}
            mb="4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            isRequired={true}
            mb="4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button colorScheme="teal" type="submit" mr={"10px"}>
            Register
          </Button>
        </Box>
      </form>
      <Box
        w={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button
          colorScheme="teal"
          variant={"outline"}
          onClick={signInWithGoogle}
        >
          Continue with Google
        </Button>
        <Text>
          Already Registered?
          <Link style={{ color: "blue" }} to={"/login"}>
            {" "}
            Login Here
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;
