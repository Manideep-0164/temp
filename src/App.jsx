import { Box } from "@chakra-ui/react";
import "./App.css";
import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Form from "./components/Form";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </Box>
  );
}

export default App;
