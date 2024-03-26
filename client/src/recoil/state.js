import { atom, selector } from "recoil";

export const recoilSelectedPosts = atom({
  //an example in the about page
  key: "selectedPosts", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
