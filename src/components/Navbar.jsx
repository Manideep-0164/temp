import { Box, Button, UnorderedList } from "@chakra-ui/react";
import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const linkStyles = {
  color: "white",
  backgroundColor: "blue",
  padding: "2px 4px",
  borderRadius: "5px",
  width: "120px",
  textAlign: "center",
};

const Navbar = () => {
  const { logout, setSignUpStatus, signUpStatus } = useContext(AuthContext);

  console.log(signUpStatus);

  const handleLogout = () => {
    console.log("logout", signUpStatus);
    logout();
    setSignUpStatus(false);
  };

  return (
    <Box
      borderBottom={"1px solid"}
      display={"flex"}
      justifyContent={"space-evenly"}
      p={"15px"}
      mb={"10px"}
    >
      <Link style={linkStyles} to={"/"}>
        Register
      </Link>
      <Link style={linkStyles} to={"/todo"}>
        Todo
      </Link>
      {signUpStatus && <Button onClick={handleLogout}>Logout</Button>}
    </Box>
  );
};

export default Navbar;
