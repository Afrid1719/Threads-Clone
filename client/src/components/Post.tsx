import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces/i-post";
import useShowToast from "../hooks/useShowToast";
import { IMessageResponse, IUser } from "../interfaces/i-user";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";

type PostProps = {
  post: IPost;
  authorId: string;
};

const Post = ({ post, authorId }: PostProps) => {
  const [author, setAuthor] = useState<IUser | null>(null);
  const currentUser: IUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const res = await fetch(`/api/users/by-id/${authorId}`);
        const data: IUser | IMessageResponse = await res.json();
        if ((data as IMessageResponse).success === false) {
          console.error((data as IMessageResponse).message);
          showToast("Failed", "Unable to get author details", "error");
          return;
        }
        setAuthor(data as IUser);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
        showToast("Error", error.message, "error");
        setAuthor(null);
      }
    };

    getAuthor();
  }, [authorId, showToast]);

  if (!author) {
    return;
  }

  const AuthorProfileUrl = `/${author.username}`;
  const navigateToProfilePage = (evt: React.MouseEvent<HTMLSpanElement>) => {
    evt.preventDefault();
    navigate(AuthorProfileUrl);
  };

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) {
        return;
      }
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data: IMessageResponse = await res.json();
      if ((data as IMessageResponse).success === false) {
        showToast("Error", (data as IMessageResponse).message, "error");
        return;
      }
      showToast("Success", "Post deleted successfully!", "success");
      // TODO: Do not refresh the entire page, rather just re-render the Posts comp
      navigate(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Link to={AuthorProfileUrl}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={author?.name}
            src={author?.profilePic}
            onClick={navigateToProfilePage}
          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {/* Users replied */}
            {post.replies?.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {!!post.replies![0] && (
              <Avatar
                size="xs"
                name="John Doe"
                src="https://bit.ly/dan-abramov"
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {!!post.replies![1] && (
              <Avatar
                size="xs"
                name="John Doe"
                src="https://bit.ly/tioluwani-kolawole"
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
              />
            )}
            {!!post.replies![2] && (
              <Avatar
                size="xs"
                name="John Doe"
                src="https://bit.ly/kent-c-dodds"
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={navigateToProfilePage}
              >
                {author?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={3} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt!))} ago
              </Text>
              {currentUser?._id === author?._id && (
                <DeleteIcon fontSize={"small"} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
