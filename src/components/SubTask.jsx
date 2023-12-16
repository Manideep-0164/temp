// import React from "react";

import { updateDoc, doc } from "firebase/firestore";
import { db } from "../configs/firebase";
import { Box, Checkbox, Text } from "@chakra-ui/react";

const SubTask = (props) => {
  const { task, formatDate, fetchSubTasks, todoId } = props;
  const { id, title, status, createdAt, userName } = task;

  const handleToggle = async () => {
    try {
      const docRef = doc(db, `todos/${todoId}/SubTasks`, id);
      const updatedTask = {
        status: !status,
      };
      await updateDoc(docRef, updatedTask);
      fetchSubTasks();
    } catch (error) {
      console.log("Error updating Sub Task:", error);
    }
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
        {/* {status ? "Done" : "Pending"} */}
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
        <Text>CreatedAt: {formatDate(createdAt)}</Text>
        <Text fontWeight={"bold"}>
          user: {userName ? userName : "Unknown User"}
        </Text>
      </Box>
    </Box>
  );
};

export default SubTask;
