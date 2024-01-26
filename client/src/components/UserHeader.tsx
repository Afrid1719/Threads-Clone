import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { IMessageResponse, IUser } from "../interfaces/i-user";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

type UserHeaderProps = {
  user: IUser;
};

const UserHeader = ({ user }: UserHeaderProps) => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const currentUser: IUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState<boolean>(
    user.followers!.includes(currentUser?._id || "")
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Profile Link copied", "", "success", 2000);
    });
  };

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      navigate("/auth");
    }
    try {
      setIsUpdating(true);
      const res = await fetch(`api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: IMessageResponse = await res.json();

      if (data.success === false) {
        console.error(data.message);
        showToast("Failed", data.message, "error");
        return;
      }

      setFollowing(!following);
      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers = user.followers!.filter(
          (key) => key !== currentUser._id
        );
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers!.push(currentUser._id!);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message);
      showToast("Error", error?.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilePic || ""}
            size={{ base: "md", md: "xl" }}
          />
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id === user._id ? (
        <Link as={RouterLink} to="/edit/profile">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      ) : (
        <Button
          size={"sm"}
          onClick={handleFollowUnfollow}
          isLoading={isUpdating}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers?.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          pb={3}
          color={"gray.light"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
