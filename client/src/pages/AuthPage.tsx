import { useRecoilState } from "recoil";
import LoginCard from "../components/LoginCard";
import SignUpCard from "../components/SignUpCard";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const [authScreen] = useRecoilState(authScreenAtom);
  return <>{authScreen == "login" ? <LoginCard /> : <SignUpCard />}</>;
};

export default AuthPage;
