import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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
