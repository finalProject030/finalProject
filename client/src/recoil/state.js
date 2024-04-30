import { atom, selector } from "recoil";

export const recoilSelectedPosts = atom({
  //an example in the about page
  key: "selectedPosts", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const recoilSelectedStep = atom({
  //an example in the about page
  key: "SelectedStep", // unique ID (with respect to other atoms/selectors)
  default: "posts", // default value (aka initial value)
});

export const globalJsonData = atom({
  key: "globalJsonData",
  default: "", // default value for the global string
});

export const urlServer = atom({
  key: "urlServer",
  default: "http://localhost:3000", // default value for the global string
});
