import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { IMessageResponse, IUser } from "../interfaces/i-user";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const showToast = useShowToast();
  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`api/users/by-username/${username}`);
        const data: IUser | IMessageResponse = await res.json();
        if ((data as IMessageResponse).success === false) {
          console.error(data);
          showToast("Error", (data as IMessageResponse).message, "error");
          return;
        }
        setUser(data as IUser);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        showToast("Error", error.message, "error");
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
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
      <UserPost
        likes={1200}
        replies={481}
        postImg="/post1.png"
        postTitle="Let's talk about threads."
      />
      <UserPost
        likes={754}
        replies={41}
        postImg="/post2.png"
        postTitle="Let's talk about threads."
      />
      <UserPost
        likes={500}
        replies={210}
        postImg="/post3.png"
        postTitle="Let's talk about threads."
      />
      <UserPost
        likes={112}
        replies={1}
        postImg="/post4.png"
        postTitle="Let's talk about threads."
      />
    </>
  );
};

export default UserPage;
