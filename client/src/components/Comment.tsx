import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { IReply } from "../interfaces/i-post";

type CommentProps = {
  reply: IReply;
  isLastReply: boolean;
};

const Comment = ({ reply, isLastReply }: CommentProps) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} name={reply.name} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.username}
            </Text>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!isLastReply && <Divider my={4} />}
    </>
  );
};

export default Comment;
