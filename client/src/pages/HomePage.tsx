import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces/i-post";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";

const HomePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/posts/feeds");
        const data: { feeds: IPost[] } = await res.json();
        setPosts(data.feeds);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err.message);
        showToast("Failed to load the Feeds", "", "error");
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [showToast]);

  return (
    <>
      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed</h1>
      )}

      {loading && (
        <Flex justifyContent={"center"}>
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.length > 0 &&
        posts.map((post) => (
          <Post key={post._id} post={post} authorId={post.postedBy} />
        ))}
    </>
  );
};

export default HomePage;
