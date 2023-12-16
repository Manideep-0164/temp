import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Box, Heading, Input, Button } from "@chakra-ui/react";

import { auth } from "../configs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { setSignUpStatus, signUpStatus } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign In Success.");

      setSignUpStatus(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Invalid credentials.");
        return;
      }
      console.log("Error signing In:", error);
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
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
