import { atom } from "recoil";

const tokenState = atom({
  key: "accessToken",
  default: "",
});

export { tokenState };
