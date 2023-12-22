import { extendTheme } from "@chakra-ui/react";

const rainbowTheme = extendTheme({
  colors: {
    orange: {
      50: "e3a178",
      100: "d57234",
      200: "ba5f26",
      500: "87451c",
    },
    brown: {
      50: "87451c",
      100: "a97d75",
      200: "8a5e56",
      500: "8a5e56",
    },
    purple: {
      50: "eac8f9",
      100: "dca3f5",
      200: "c86cef",
      500: "b335e9",
    },
    blue: {
      50: "8ae1fc",
      100: "60d7fb",
      200: "24c8f9",
      500: "10c3f9",
    },
    moonStone: {
      50: "10c3f9",
      100: "32a8c3",
      200: "2a8ca2",
      500: "217082",
    },
  },
});

export { rainbowTheme };
