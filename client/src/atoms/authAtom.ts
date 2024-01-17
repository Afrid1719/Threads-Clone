import { RecoilState, atom } from "recoil";

const authScreenAtom: RecoilState<string> = atom({
  key: "authScreenAtom",
  default: "login",
});

export default authScreenAtom;
