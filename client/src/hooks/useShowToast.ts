import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = useCallback(
    (
      title: string,
      description: string = "",
      status: "success" | "error" | "warning" | "info" | "loading" | undefined,
      duration: number = 5000
    ) => {
      toast({
        title,
        description,
        isClosable: true,
        duration: duration,
        position: "top",
        status: status,
      });
    },
    [toast]
  );
  return showToast;
};

export default useShowToast;
