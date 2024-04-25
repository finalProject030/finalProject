import { BrowserRouter, Routes, Route } from "react-router-dom";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Home from "./pages/Home";
import Chatbot from "./components/Chatbot";
import UserPosts from "./components/UserPosts/UserPosts";
import Footer from "./components/Footer";
import Feed from "./pages/Feed";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatbot message="8+10?" />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/user-posts" element={<UserPosts />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
