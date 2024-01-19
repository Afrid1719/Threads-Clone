import { ToastOptions, useToast } from "@chakra-ui/react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = (
    title: string,
    description: string = "",
    status: ToastOptions["status"] = "default"
  ) => {
    toast({
      title,
      description,
      isClosable: true,
      duration: 5000,
      position: "top",
      status: status,
    });
  };
  return showToast;
};

export default useShowToast;
