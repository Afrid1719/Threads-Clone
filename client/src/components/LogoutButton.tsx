import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { IMessageResponse } from "../interfaces/i-user";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: IMessageResponse = await res.json();
      if (data.success === false) {
        showToast("Error", data.message, "error");
        return;
      }
      showToast("Success", data.message, "success");
      localStorage.removeItem("user-threads");
      setUser(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message);
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
