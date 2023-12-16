import { Input, Box, Heading, Button, Text } from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { db } from "../configs/firebase";
import { addDoc, collection } from "firebase/firestore";

const Form = () => {
  const defaultForm = {
    name: "",
    email: "",
    age: "",
    password: "",
    social: {
      twitter: "",
      facebook: "",
    },
    mobileNumbers: [
      {
        number: "",
      },
    ],
  };
  const { register, handleSubmit, formState, reset, control } = useForm({
    defaultValues: defaultForm,
  });

  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "mobileNumbers",
    control,
  });

  const submitForm = async (formData) => {
    try {
      const formUserCollectionRef = collection(db, "formUsers");
      await addDoc(formUserCollectionRef, formData);
      reset();
      console.log("Successfully submitted.");
    } catch (error) {
      console.log("Error Submitting form:", error);
    }
  };

  return (
    <Box
      w={"45%"}
      margin={"auto"}
      display={"flex"}
      flexDirection={"column"}
      gap={"5px"}
      p={"20px"}
    >
      <Heading textAlign={"center"}>Form</Heading>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box
          maxW="md"
          mx="auto"
          mt="8"
          p="4"
          borderWidth="1px"
          borderRadius="lg"
        >
          <Text color={"red"}>{errors.name?.message}</Text>
          <Input
            type="text"
            placeholder="User name"
            mb="4"
            {...register("name", {
              required: {
                value: true,
                message: "name is required",
              },
            })}
          />

          <Text color={"red"}>{errors.email?.message}</Text>
          <Input
            type="email"
            placeholder="Example@gmail.com"
            mb="4"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
          />

          <Text color={"red"}>{errors.age?.message}</Text>
          <Input
            type="number"
            placeholder="Age"
            mb="4"
            {...register("age", {
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />

          <Text color={"red"}>{errors.password?.message}</Text>
          <Input
            type="password"
            placeholder="Password"
            mb="4"
            {...register("password", {
              pattern: {
                value:
                  /(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|;:'",.<>?/~`\\[\]\\-]).{8,}$/,
                message: "Password must contains 8 letters",
              },
              required: {
                value: true,
                message: "Password was required",
              },
            })}
          />

          <Input
            type="text"
            placeholder="Twitter"
            mb="4"
            {...register("social.twitter")}
          />

          <Input
            type="text"
            placeholder="Facebook"
            mb={"4"}
            {...register("social.facebook")}
          />

          <Text>List of Mobile Numbers</Text>

          {fields.map((field, index) => (
            <Box key={field.id} mb={2}>
              <Input
                type="text"
                mb={2}
                {...register(`mobileNumbers.${index}.number`)}
              />
              {index > 0 && (
                <Button onClick={() => remove(index)}>Remove</Button>
              )}
            </Box>
          ))}

          <Button onClick={() => append({ number: "" })}>
            Add Mobile Number
          </Button>

          <Button colorScheme="teal" type="submit" mr={"10px"}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form;
