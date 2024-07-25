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
import PostPage from "./pages/PostPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatbot message="8+10?" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/user-posts" element={<UserPosts />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Route>
      </Routes>
      <Footer />
      <ScrollToTop />
    </BrowserRouter>
  );
}
