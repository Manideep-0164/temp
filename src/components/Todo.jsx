import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Select,
  Input,
  Button,
  useColorMode,
} from "@chakra-ui/react";

import TodoInput from "../components/TodoInput";
import TodoItem from "../components/TodoItem";
import ToastNotification from "./toastNotification";
import { db, messaging } from "../configs/firebase";

import {
  query,
  where,
  collection,
  getDocs,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import { onMessage } from "firebase/messaging";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [todoStatus, setTodoStatus] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDate, setTodoDate] = useState("");
  const [totalTodos, setTotalTodos] = useState(0);
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationData, setNotificationData] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();

  // const fetchTodos = async () => {
  //   try {
  //     const todoCollectionRef = collection(db, "todos");
  //     // get user details

  //     const q = query(todoCollectionRef, orderBy("order"));

  //     const todosSnapshot = await getDocs(q);
  //     const snapshot = await getCountFromServer(q);

  //     const todosFromDB = todosSnapshot.docs.map((todoDoc) => ({
  //       ...todoDoc.data(),
  //       id: todoDoc.id,
  //     }));

  //     setTotalTodos(snapshot.data().count);

  //     // const subTasks = todosFromDB.filter((todo) => todo.type === "child");
  //     const parentTasks = todosFromDB.filter((todo) => todo.type === "parent");

  //     setTodos(parentTasks);
  //     // setSubTodos(subTasks);
  //   } catch (error) {
  //     console.log("Error fetching todos:", error);
  //   }
  // };

  const fetchTodos = async () => {
    const todoCollectionRef = collection(db, "todos");

    let q = query(todoCollectionRef);

    q = query(q, where("type", "==", "parent"));

    if (!filterActive) {
      q = query(q, orderBy("order"));
    }

    if (todoStatus) {
      q = query(q, where("status", "==", todoStatus === "true"));
    }

    if (ownerName) {
      q = query(q, where("userName", "==", ownerName));
    }

    if (todoDate) {
      q = query(q, orderBy("todoCreatedAt", todoDate));
    }

    if (todoTitle) {
      q = query(q, orderBy("title", todoTitle));
    }

    const todosSnapshot = await getDocs(q);
    const snapshot = await getCountFromServer(q);

    const filteredTodos = todosSnapshot.docs.map((todo) => ({
      ...todo.data(),
      id: todo.id,
    }));

    console.log(filteredTodos);

    // console.log(filteredTodos);
    setTotalTodos(snapshot.data().count);
    setTodos(filteredTodos);
  };

  const handleReset = () => {
    setFilterActive(false);
    setOwnerName("");
    setTodoTitle("");
    setTodoDate("");
    setTodoStatus("");
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

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const dataFromServer = payload.data.title;
      setNotificationStatus(true);
      setNotificationData(
        `${dataFromServer ? dataFromServer : "Todo"} was Deleted.`
      );
      fetchTodos();
      console.log("Message from Server:", payload.data.message);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [ownerName, todoStatus, todoTitle, todoDate]);

  return (
    <Box
      w={"60%"}
      m={"auto"}
      display={"flex"}
      flexDirection={"column"}
      gap={"20px"}
    >
      <Heading textAlign={"center"}>Todo App.</Heading>

      <Text>Total Available Tasks: {totalTodos}</Text>

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
            value={todoStatus}
            onChange={(e) => {
              setTodoStatus(e.target.value);
              setFilterActive(true);
            }}
          >
            <option value="">Select</option>
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
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </Box>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Heading m={0} p={"0"} fontSize={"30px"}>
          Sort:
        </Heading>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Text>Task Name:</Text>
          <Select
            value={todoTitle}
            placeholder="Select"
            onChange={(e) => setTodoTitle(e.target.value)}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </Select>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Text>Date Created:</Text>
          <Select
            value={todoDate}
            onChange={(e) => setTodoDate(e.target.value)}
          >
            <option value="">Select</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </Select>
        </Box>
      </Box>

      <Box display={"flex"} gap={"20px"}>
        <Button onClick={handleReset}>Reset Filters</Button>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "dark" : "light"}
        </Button>
      </Box>

      <TodoInput fetchTodos={fetchTodos} getUserName={getUserName} />
      {todos.length === 0 && (
        <Text textAlign={"center"} fontWeight={""}>
          No Todos Available.
        </Text>
      )}
      {todos.length > 0 &&
        todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            index={index}
            todo={todo}
            todos={todos}
            notificationData={notificationData}
            setTodos={setTodos}
            setNotificationData={setNotificationData}
            setNotificationStatus={setNotificationStatus}
            fetchTodos={fetchTodos}
            getUserName={getUserName}
          />
        ))}

      {notificationStatus && (
        <ToastNotification
          title={notificationData}
          setNotificationStatus={setNotificationStatus}
          setNotificationData={setNotificationData}
          notificationStatus={notificationStatus}
        />
      )}
    </Box>
  );
};

export default Todo;
