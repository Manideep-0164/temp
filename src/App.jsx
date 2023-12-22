import { Box } from "@chakra-ui/react";
import "./App.css";
import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Form from "./components/Form";
import PrivateRoute from "./components/PrivateRoute";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todo" element={<PrivateRoute element={<Todo />} />} />
          <Route path="/form" element={<PrivateRoute element={<Form />} />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
