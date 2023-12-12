import React, { useEffect, useState } from "react";

import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../configs/firebase";
import { Box, Text, Checkbox, Button } from "@chakra-ui/react";

const TodoItem = (props) => {
  let userId = "";
  const { todo, fetchTodos } = props;
  const { id, title, status, todoCreatedAt, user } = todo;
  const handleToggle = async () => {
    try {
      const docRef = doc(db, "todos", id);
      const updatedTodo = {
        status: !status,
      };
      await updateDoc(docRef, updatedTodo);
      fetchTodos(userId);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "todos", id);
      await deleteDoc(docRef);
      fetchTodos(userId);
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  // format date like: (Month DD, Time/12HR)
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date.toDate());
  };

  return (
    <Box
      display={"flex"}
      gap={"20px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      border={"1px solid gray"}
      p={"5px"}
      borderRadius={"5px"}
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
        <Text fontWeight={"bold"}>user: {user}</Text>
      </Box>
      <Button colorScheme="red" variant={"solid"} onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  );
};

export default TodoItem;
