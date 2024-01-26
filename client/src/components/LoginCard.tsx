import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import {
  IMessageResponse,
  IUserLoginRequest,
  IUser,
} from "../interfaces/i-user";
import useShowToast from "../hooks/useShowToast";
import { userAtom } from "../atoms/userAtom";

const LoginCard = () => {
  const showToast = useShowToast();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [credentials, setCredentials] = useState<IUserLoginRequest>({
    username: "",
    password: "",
  });
  const handleUsernameChange = (
    evt: React.FormEvent<HTMLInputElement>
  ): void => {
    //@ts-expect-error Value property will exist on event.target
    setCredentials({ ...credentials, username: evt.target?.value });
  };
  const handlePasswordChange = (
    evt: React.FormEvent<HTMLInputElement>
  ): void => {
    //@ts-expect-error Value property will exist on event.target
    setCredentials({ ...credentials, password: evt.target?.value });
  };
  const handleLogin = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      setIsLoggingIn(true);
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data: IUser | IMessageResponse = await res.json();
      if ((data as IMessageResponse).success === false) {
        showToast("Error", (data as IMessageResponse)?.message, "error");
        return;
      }
      showToast("Success", "User logged in successfully!", "success");
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data as IUser);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message);
      showToast("Error", error?.message, "error");
    } finally {
      setIsLoggingIn(false);
    }
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" onChange={handleUsernameChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={handlePasswordChange}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  loadingText="Logging In"
                  isLoading={isLoggingIn}
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Don't have an account?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => setAuthScreen("signup")}
                  >
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginCard;
