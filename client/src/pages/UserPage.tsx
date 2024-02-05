import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { IMessageResponse } from "../interfaces/i-user";
import { Flex, Spinner } from "@chakra-ui/react";
import { IPost } from "../interfaces/i-post";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [fetchingPosts, setFetchingPosts] = useState<boolean>(false);
  const showToast = useShowToast();
  const { username } = useParams();

  useEffect(() => {
    const getPosts = async () => {
      try {
        setFetchingPosts(true);
        const res = await fetch(`/api/posts/user/${username}`);
        const data: IPost[] | IMessageResponse = await res.json();
        if ((data as IMessageResponse).success === false) {
          showToast("Error", (data as IMessageResponse).message, "error");
          return;
        }
        setPosts(data as IPost[]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post: IPost) => (
        <Post key={post._id} post={post} authorId={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
