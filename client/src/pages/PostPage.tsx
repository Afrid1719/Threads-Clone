import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useEffect, useState } from "react";
import { IMessageResponse, IUser } from "../interfaces/i-user";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { IPost, IReply } from "../interfaces/i-post";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState<IPost | null>(null);
  const { pid } = useParams();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser: IUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data: IPost | IMessageResponse = await res.json();
        if ((data as IMessageResponse).success === false) {
          console.error((data as IMessageResponse).message);
          showToast("Failed", (data as IMessageResponse).message, "error");
        }
        console.log(data as IPost);
        setPost(data as IPost);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
        showToast("Error", error.message, "error");
        setPost(null);
      }
    };

    getPost();
  }, [pid, showToast]);

  const handleDeletePost = async () => {
    if (!post) {
      return;
    }
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
      navigate(`/${user?.username}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  return (
    <>
      <Flex>
        <Flex gap={3} w={"full"} alignItems={"center"}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={3} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post?.createdAt ?? ""))} ago
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon
              fontSize={20}
              onClick={handleDeletePost}
              cursor={"pointer"}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{post?.text}</Text>
      {!!post?.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={post!} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {post?.replies?.map((reply: IReply) => (
        <Comment
          key={reply._id}
          reply={reply}
          isLastReply={
            reply._id === post.replies![post.replies!.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
