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
import { useRef, useState } from "react";
import { IMessageResponse, IUser } from "../interfaces/i-user";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";

const UpdateProfilePage = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const showToast = useShowToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imgUrl, handleImageChange } = usePreviewImage();
  const [user, setUser] = useRecoilState<IUser>(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState<IUser>({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    password: "",
    profilePic: user?.profilePic || "",
  });

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch(`/api/users/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data: IUser | IMessageResponse = await res.json();
      if ((data as IMessageResponse).success === false) {
        console.error((data as IMessageResponse).message);
        showToast("Failed", (data as IMessageResponse).message, "error");
        return;
      }
      showToast("Success", "Profile updated successfully!", "success");
      setUser(data as IUser);
      localStorage.setItem("user-threads", JSON.stringify(data as IUser));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message);
      showToast("Error", error?.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl ?? inputs.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileInputRef.current?.click()}>
                  Change Avatar
                </Button>
                <Input
                  w="full"
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.name}
              onChange={(evt: React.FormEvent<HTMLInputElement>) =>
                setInputs({
                  ...inputs,
                  name: (evt.target as HTMLInputElement).value,
                })
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.username}
              onChange={(evt: React.FormEvent<HTMLInputElement>) =>
                setInputs({
                  ...inputs,
                  username: (evt.target as HTMLInputElement).value,
                })
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputs.email}
              onChange={(evt: React.FormEvent<HTMLInputElement>) =>
                setInputs({
                  ...inputs,
                  email: (evt.target as HTMLInputElement).value,
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio."
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.bio}
              onChange={(evt: React.FormEvent<HTMLInputElement>) =>
                setInputs({
                  ...inputs,
                  bio: (evt.target as HTMLInputElement).value,
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                _placeholder={{ color: "gray.500" }}
                placeholder="Password"
                onChange={(evt: React.FormEvent<HTMLInputElement>) =>
                  setInputs({
                    ...inputs,
                    password: (evt.target as HTMLInputElement).value,
                  })
                }
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
              type="submit"
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              loadingText="Saving"
              isLoading={isSaving}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;
