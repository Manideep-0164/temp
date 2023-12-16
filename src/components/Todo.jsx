import { useEffect, useState } from "react";

import { Box, Heading, Text, Select, Input } from "@chakra-ui/react";
import TodoInput from "../components/TodoInput";
import TodoItem from "../components/TodoItem";
import {
  query,
  where,
  collection,
  getDocs,
  orderBy,
  or,
  and,
} from "firebase/firestore";
import { db } from "../configs/firebase";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [todoStatus, setTodoStatus] = useState("");

  const fetchTodos = async () => {
    try {
      const todoCollectionRef = collection(db, "todos");
      // get user details

      const q = query(todoCollectionRef, orderBy("order"));

      const { docs } = await getDocs(q);

      const todosFromDB = docs.map((todoDoc) => ({
        ...todoDoc.data(),
        id: todoDoc.id,
      }));

      setTodos(todosFromDB);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const getUserName = async (user = null) => {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("uid", "==", user?.uid || null));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userData = querySnapshot.docs[0].data();
    return userData.name;
  };

  const filterTasks = async (e) => {
    let todosSnapshot;
    // const { value } = e.target;
    const value = todoStatus;

    console.log(value);

    const todoCollectionRef = collection(db, "todos");

    if (!value && !ownerName) {
      todosSnapshot = await getDocs(todoCollectionRef);
    } else {
      const q = query(
        todoCollectionRef,
        where("status", "==", value === "true"),
        ownerName && where("userName", "==", ownerName)
      );
      todosSnapshot = await getDocs(q);
    }

    const filteredTodos = todosSnapshot.docs.map((todo) => ({
      ...todo.data(),
      id: todo.id,
    }));

    // console.log(filteredTodos);

    setTodos(filteredTodos);
  };

  useEffect(() => {
    console.log("bFrom useEffect");
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [ownerName, todoStatus]);

  return (
    <Box
      w={"50%"}
      m={"auto"}
      display={"flex"}
      flexDirection={"column"}
      gap={"20px"}
    >
      <Heading textAlign={"center"}>Todo App.</Heading>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Heading m={0} p={"0"} fontSize={"30px"}>
          Filter:
        </Heading>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Text>Status:</Text>
          <Select
            placeholder="Select"
            onChange={(e) => setTodoStatus(e.target.value)}
          >
            <option value="true">Done</option>
            <option value="false">Pending</option>
          </Select>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Text>User:</Text>
          <Input
            type="text"
            placeholder="Task owner name"
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </Box>
      </Box>
      <TodoInput fetchTodos={fetchTodos} getUserName={getUserName} />
      {todos.length === 0 && <Text>Please Add todos.</Text>}
      {todos.length > 0 &&
        todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            index={index}
            todo={todo}
            todos={todos}
            setTodos={setTodos}
            fetchTodos={fetchTodos}
            getUserName={getUserName}
          />
        ))}
    </Box>
  );
};

export default Todo;
