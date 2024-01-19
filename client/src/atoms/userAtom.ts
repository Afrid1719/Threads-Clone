import { RecoilState, atom } from "recoil";
import { IUserSignUpResponse } from "../interfaces/i-user";

export const userAtom: RecoilState<IUserSignUpResponse | null> = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user-threads") ?? ""),
});
