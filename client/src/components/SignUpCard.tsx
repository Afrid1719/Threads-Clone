import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import {
  IMessageResponse,
  IUserSignUpRequest,
  IUserSignUpResponse,
} from "../interfaces/i-user";
import useShowToast from "../hooks/useShowToast";
import { userAtom } from "../atoms/userAtom";

const SignUpCard = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const showToast = useShowToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [inputs, setInputs] = useState<IUserSignUpRequest>({
    name: "",
    username: "",
    password: "",
    email: "",
  });

  const handleNameChange = (evt: React.FormEvent<HTMLInputElement>): void => {
    //@ts-expect-error Value property will exist on event.target
    setInputs({ ...inputs, name: evt.target?.value });
  };

  const handleUsernameChange = (
    evt: React.FormEvent<HTMLInputElement>
  ): void => {
    //@ts-expect-error Value property will exist on event.target
    setInputs({ ...inputs, username: evt.target?.value });
  };
  const handleEmailChange = (evt: React.FormEvent<HTMLInputElement>): void => {
    //@ts-expect-error Value property will exist on event.target
    setInputs({ ...inputs, email: evt.target?.value });
  };
  const handlePasswordChange = (
    evt: React.FormEvent<HTMLInputElement>
  ): void => {
    //@ts-expect-error Value property will exist on event.target
    setInputs({ ...inputs, password: evt.target?.value });
  };

  const handleSignup = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data: IUserSignUpResponse | IMessageResponse = await res.json();
      if ((data as IMessageResponse).success === false) {
        showToast("Error", (data as IMessageResponse)?.message, "error");
        return;
      }
      showToast("Success", "Account created successfully!", "success");
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data as IUserSignUpResponse);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message);
      showToast("Error", error?.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={handleSignup}>
              <HStack>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type="text"
                      onChange={handleNameChange}
                      value={inputs.name}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      onChange={handleUsernameChange}
                      value={inputs.username}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  pattern=".+@.+\.com"
                  title="Please provide a valid email"
                  onChange={handleEmailChange}
                  value={inputs.email}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={handlePasswordChange}
                    value={inputs.password}
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
                  loadingText="Submitting"
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Sign up
                </Button>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUpCard;
