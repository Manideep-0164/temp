import React, { useEffect, useContext, useState } from "react";

import { db } from "../configs/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Box, Input, Button } from "@chakra-ui/react";
import { AuthContext } from "../contexts/AuthContext";

function TodoInput({ fetchTodos }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");

  const handleClick = async () => {
    if (!title) return;

    try {
      const todoItem = {
        title: title,
        status: false,
        todoCreatedAt: new Date(),
        author: user?.uid ? user.uid : null,
      };

      const todoCollectionRef = collection(db, "todos");

      await addDoc(todoCollectionRef, todoItem);

      fetchTodos();

      setTitle("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Input
        type="text"
        placeholder="Todo title."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button colorScheme="green" variant={"solid"} onClick={handleClick}>
        Add Todo
      </Button>
    </Box>
  );
}

export default TodoInput;
