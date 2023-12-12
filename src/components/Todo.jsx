import React, { useEffect, useState, useContext } from "react";

import { Box, Heading, Text } from "@chakra-ui/react";
import TodoInput from "../components/TodoInput";
import TodoItem from "../components/TodoItem";
import { AuthContext } from "../contexts/AuthContext";
import {
  collection,
  doc,
  getDocs,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../configs/firebase";

const Todo = () => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const todoCollectionRef = collection(db, "todos");
      const usersCollectionRef = collection(db, "users");
      // get user details

      const { docs } = await getDocs(todoCollectionRef);

      const todosFromDB = await Promise.all(
        docs.map(async (taskDoc) => {
          const taskInfo = taskDoc.data();
          if (!taskInfo.author) {
            return {
              ...taskInfo,
              id: taskDoc.id,
              user: "Unknown User",
            };
          }
          const q = query(
            usersCollectionRef,
            where("uid", "==", taskInfo.author)
          );
          const usersSnapshot = await getDocs(q);
          if (usersSnapshot.docs.length > 0) {
            const userDoc = usersSnapshot.docs[0];
            const userData = userDoc?.data();
            return {
              ...taskInfo,
              id: taskDoc.id,
              user: userData?.name ? userData?.name : "Unknown User",
            };
          }
        })
      );

      setTodos(todosFromDB);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Box
      w={"50%"}
      m={"auto"}
      display={"flex"}
      flexDirection={"column"}
      gap={"20px"}
    >
      <Heading textAlign={"center"}>Todo App.</Heading>
      <TodoInput fetchTodos={fetchTodos} />
      {todos.length === 0 && <Text>Please Add todos.</Text>}
      {todos.length > 0 &&
        todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} fetchTodos={fetchTodos} />
        ))}
    </Box>
  );
};

export default Todo;
