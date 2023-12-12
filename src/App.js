import "./App.css";
import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import Register from "./pages/Register";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </>
  );
}

export default App;
