import { useContext, useState } from "react";

import { db } from "../configs/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Box, Input, Button } from "@chakra-ui/react";
import { AuthContext } from "../contexts/AuthContext";

function TodoInput({ fetchTodos, getUserName }) {
  const { user, token } = useContext(AuthContext);
  const [title, setTitle] = useState("");

  const handleClick = async () => {
    if (!title) return;

    console.log("From Add Todo", token);

    try {
      const todoItem = {
        title: title,
        status: false,
        todoCreatedAt: Timestamp.now(),
        author: user?.uid ? user.uid : null,
        userName: user?.uid ? await getUserName(user) : null,
        order: Timestamp.now(),
        type: "parent",
        isParentOf: [],
        isChildOf: null,
        // userAccessTKN: user?.accessToken ? user?.accessToken : null,
      };

      console.log(todoItem);

      const todoCollectionRef = collection(db, "todos");

      await addDoc(todoCollectionRef, todoItem);

      fetchTodos();
      console.log("bFrom add todo");

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
        color={"brown.500"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button bgColor="brown.500" variant={"solid"} onClick={handleClick}>
        Add Todo
      </Button>
    </Box>
  );
}

export default TodoInput;
