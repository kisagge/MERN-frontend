import { atom } from "recoil";

const tokenState = atom({
  key: "accessToken",
  default: "",
});

const userIdState = atom({
  key: "userId",
  default: "",
});

export { tokenState, userIdState };
