import { useEffect, useState } from "react";
import { IMessageResponse, IUser } from "../interfaces/i-user";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/by-username/${username}`);
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

  return { loading, user };
};

export default useGetUserProfile;
