import { RecoilState, atom } from "recoil";
import { IUserLoginResponse, IUserSignUpResponse } from "../interfaces/i-user";

export const userAtom: RecoilState<
  IUserSignUpResponse | IUserLoginResponse | null
> = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user-threads") || "null"),
});
