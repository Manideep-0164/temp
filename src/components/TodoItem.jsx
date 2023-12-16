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
  writeBatch,
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
  setTodos,
}) => {
  const { id, title, status, todoCreatedAt, userName } = todo;
  const { user } = useContext(AuthContext);
  const [taskTitle, setTaskTitle] = useState("");
  const [subTaskData, setSubTaskData] = useState([]);

  // format date like: (Month DD, Time/12HR)
  const formatDate = (date) => {
    const momentObject = moment.unix(date);
    return momentObject.format("MMM D, h:mm A");
  };

  const handleToggle = async (cStatus = false, subTasksStatus = false) => {
    try {
      const docRef = doc(db, "todos", id);
      const updatedTodo = {
        status: cStatus ? subTasksStatus : !status,
      };
      await updateDoc(docRef, updatedTodo);
      console.log("bFrom toggle");
      fetchTodos();
    } catch (error) {
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
      console.log("Error deleting todo:", error);
    }
  };

  const fetchSubTasks = async (event) => {
    try {
      const subTaskCollectionRef = collection(db, `todos/${id}/SubTasks`);
      const subTasksSnapshot = await getDocs(subTaskCollectionRef);
      if (subTasksSnapshot.empty) {
        setSubTaskData([]);
        return;
      }

      const data = subTasksSnapshot.docs.map((subTask) => ({
        ...subTask.data(),
        id: subTask.id,
      }));

      const subTasksStatus = data.every((subTask) => subTask.status === true);

      // (status && !subTasksStatus) => if initially parent todo marked as true, then if we unTick any one of the subTask.
      // if (subTasksStatus || (status && !subTasksStatus)) {
      //   // event.stopPropagation();

      //   console.log("fetchSubTask-invoking-handleToggle");
      //   const cStatus = true;
      //   handleToggle(cStatus, subTasksStatus);
      // }

      setSubTaskData(data);
    } catch (error) {
      console.log("Error fetching subTasks:", error);
    }
  };

  const addSubTask = async () => {
    if (!taskTitle) return;

    try {
      const taskData = {
        title: taskTitle,
        status: false,
        createdAt: Timestamp.now(),
        author: user?.uid ? user.uid : null,
        userName: user?.uid ? await getUserName(user) : null,
      };

      const taskCollectionRef = collection(db, `todos/${id}/SubTasks`);
      await addDoc(taskCollectionRef, taskData);
      fetchSubTasks();

      setTaskTitle("");
    } catch (error) {
      console.log("Error adding task/updating todo:", error);
    }
  };

  const handleSort = async (e, dropIndex) => {
    console.log("From handle sort");
    const dragIndex = e.dataTransfer.getData("text/plain");

    const sortedTodos = [...todos];

    const [draggedItem] = sortedTodos.splice(dragIndex, 1);

    sortedTodos.splice(dropIndex, 0, draggedItem);

    const batch = writeBatch(db);
    setTodos(sortedTodos);

    sortedTodos.forEach((todo, index) => {
      const todoColRef = collection(db, "todos");
      const docRef = doc(todoColRef, todo.id);
      batch.update(docRef, { order: index });
    });

    try {
      await batch.commit();
    } catch (error) {
      console.log("Error updating batch:", error);
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
      bgColor={"whitesmoke"}
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
        <Button colorScheme="red" variant={"solid"} onClick={handleDelete}>
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
          borderRadius={"5px"}
          boxShadow={
            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
          }
          h={"140px"}
          overflowY={"scroll"}
        >
          {subTaskData.length === 0 && <Text>No Sub Tasks Available</Text>}
          {subTaskData.length > 0 &&
            subTaskData?.map((task) => (
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
