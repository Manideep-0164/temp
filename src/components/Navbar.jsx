import { Box, Button } from "@chakra-ui/react";
import { useContext } from "react";

import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const linkStyles = {
  padding: "10px 25px",
  borderRadius: "5px",
  textAlign: "center",
};

const Navbar = () => {
  const { logout, setSignUpStatus, signUpStatus } = useContext(AuthContext);

  const handleLogout = () => {
    console.log("logout Success");
    logout();
    setSignUpStatus(false);
  };

  return (
    <>
      <Box
        borderBottom={"1px solid"}
        display={"flex"}
        justifyContent={"space-evenly"}
        p={"15px"}
        mb={"10px"}
        w={"100%"}
        m={"auto"}
      >
        <Button m={0} p={0}>
          <Link style={linkStyles} to={"/"}>
            Register
          </Link>
        </Button>
        <Button m={0} p={0}>
          <Link style={linkStyles} to={"/todo"}>
            Todo
          </Link>
        </Button>
        <Button m={0} p={0}>
          <Link style={linkStyles} to={"/form"}>
            Form
          </Link>
        </Button>
        {signUpStatus && <Button onClick={handleLogout}>Logout</Button>}
      </Box>
      <Outlet />
    </>
  );
};

export default Navbar;
