import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { IUser } from "../interfaces/i-user";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const UpdateProfilePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState<IUser>({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    password: "",
    profilePic: user?.profilePic || "",
  });
  return (
    <Flex align={"center"} justify={"center"} my={"6"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={inputs.profilePic} />
            </Center>
            <Center w="full">
              <Button w="full">Change Avatar</Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="John Doe"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={inputs.name}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={inputs.username}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={inputs.email}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Your Bio."
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={inputs.bio}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              _placeholder={{ color: "gray.500" }}
            />
            <InputRightElement h={"full"}>
              <Button
                variant={"ghost"}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.500",
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default UpdateProfilePage;
