import { useState, useContext, useEffect } from "react";
import moment from "moment";
import {
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../configs/firebase";
import { Box, Text, Checkbox, Button, Input } from "@chakra-ui/react";

import { AuthContext } from "../contexts/AuthContext";
import SubTask from "./SubTask";

const TodoItem = ({
  todo,
  fetchTodos,
  getUserName,
  index,
  todos,
  setNotificationData,
  setNotificationStatus,
  // subTodos,
  setTodos,
  // setSubTodos,
}) => {
  const { id, title, status, todoCreatedAt, userName, author } = todo;
  const { user } = useContext(AuthContext);
  const [taskTitle, setTaskTitle] = useState("");
  const [subTodos, setSubTodos] = useState([]);

  // format date like: (Month DD, Time/12HR)
  const formatDate = (date) => {
    const momentObject = moment.unix(date);
    return momentObject.format("MMM D, h:mm A");
  };

  const handleToggle = async (e, flag = false, subTodosStatus = false) => {
    try {
      const docRef = doc(db, "todos", id);
      const updatedStatus = flag ? subTodosStatus : !status;
      const updatedTodo = {
        status: updatedStatus,
      };
      await updateDoc(docRef, updatedTodo);
      fetchTodos();
    } catch (error) {
      if (error.code === "permission-denied") {
        setNotificationStatus(true);
        setNotificationData("You didn't have permission to edit other todos");
        return;
      }
      console.log("Error updating todo:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "todos", id);
      await deleteDoc(docRef);
      console.log("bFrom delete");

      fetchTodos();
    } catch (error) {
      if (error.code === "permission-denied") {
        setNotificationStatus(true);
        setNotificationData("You didn't have permission to edit other todos");
        return;
      }
      console.log("Error deleting todo:", error);
    }
  };

  const fetchSubTasks = async () => {
    try {
      const subTaskCollectionRef = collection(db, `todos`);
      const q = query(
        subTaskCollectionRef,
        where("type", "==", "child"),
        where("isChildOf", "==", id)
      );
      const subTasksSnapshot = await getDocs(q);
      if (subTasksSnapshot.empty) {
        setSubTodos([]);
        return;
      }

      const data = subTasksSnapshot.docs.map((subTask) => ({
        ...subTask.data(),
        id: subTask.id,
      }));

      const subTodosStatus = data.every((subTodo) => subTodo.status === true);

      if (subTodosStatus || (status && !subTodosStatus)) {
        await handleToggle("", true, subTodosStatus);
      }

      console.log("sub-todos", data);

      setSubTodos(data);
    } catch (error) {
      console.log("Error fetching subTodos:", error);
    }
  };

  const addSubTask = async () => {
    if (!taskTitle) return;

    if (user?.uid !== author) {
      setNotificationStatus(true);
      setNotificationData("You didn't have permission to edit other todos");
      setTaskTitle("");
      return;
    }

    try {
      const taskData = {
        title: taskTitle,
        status: false,
        createdAt: Timestamp.now(),
        author: user?.uid ? user.uid : null,
        userName: user?.uid ? await getUserName(user) : null,
        type: "child",
        isParentOf: [],
        isChildOf: id,
      };

      const taskCollectionRef = collection(db, `todos`);
      await addDoc(taskCollectionRef, taskData);
      fetchSubTasks();

      setTaskTitle("");
    } catch (error) {
      console.log("Error adding subTodo:", error);
    }
  };

  const handleSort = async (e, dropIndex) => {
    console.log("From handle sort");
    const dragIndex = e.dataTransfer.getData("text/plain");

    const sortedTodos = [...todos];

    const [draggedItem] = sortedTodos.splice(dragIndex, 1);

    sortedTodos.splice(dropIndex, 0, draggedItem);

    // const batch = writeBatch(db);
    setTodos(sortedTodos);

    try {
      sortedTodos.forEach(async (todo, index) => {
        const todoDocRef = doc(db, "todos", todo.id);
        await updateDoc(todoDocRef, { order: index });
      });

      // sortedTodos.forEach((todo, index) => {
      //   const todoColRef = collection(db, "todos");
      //   const docRef = doc(todoColRef, todo.id);
      //   batch.update(docRef, { order: index });
      // });

      // await batch.commit();
    } catch (error) {
      console.log("Error updating todos:", error);
    }
  };

  useEffect(() => {
    fetchSubTasks();
  }, []);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  return (
    <Box
      className="draggable"
      border={"1px solid"}
      p={"5px"}
      borderRadius={"5px"}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDrop={(e) => handleSort(e, index)}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Todo Item  */}
      <Box
        display={"flex"}
        gap={"20px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"5px"}
      >
        <Checkbox isChecked={status} onChange={handleToggle}>
          {status ? "Done" : "Pending"}
        </Checkbox>
        <Text>{title}</Text>
        <Box
          display={"flex"}
          flexDirection={"column"}
          border={"1px solid gray"}
          fontSize={"12px"}
          p={"5px"}
          borderRadius={"8px"}
        >
          <Text>CreatedAt: {formatDate(todoCreatedAt)}</Text>
          <Text fontWeight={"bold"}>
            user: {userName ? userName : "Unknown User"}
          </Text>
        </Box>
        <Button variant={"solid"} onClick={handleDelete}>
          Delete
        </Button>
      </Box>

      {/* Sub Task */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"10px"}
      >
        {/* Sub Task Input  */}
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Input
            type="text"
            placeholder="Enter Sub Task"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <Button onClick={addSubTask}>Add Task</Button>
        </Box>

        {/* Sub Tasks Data  */}
        <Box
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          p={"5px"}
          m={"5px"}
          gap={"10px"}
          border={"1px solid"}
          borderRadius={"5px"}
          boxShadow={
            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
          }
          h={"140px"}
          overflowY={"scroll"}
        >
          {subTodos.length === 0 && <Text>No Sub Tasks Available</Text>}
          {subTodos.length > 0 &&
            subTodos?.map((task) => (
              <SubTask
                key={task?.id}
                task={task}
                todoId={id}
                formatDate={formatDate}
                fetchTodos={fetchTodos}
                fetchSubTasks={fetchSubTasks}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TodoItem;
