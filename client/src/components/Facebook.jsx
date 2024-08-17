import React, { useState } from "react";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { scrollToTop, urlServer } from "../variables";
import FacebookIcon from "@mui/icons-material/Facebook";
import LoadingSpinner from "./LoadingSpinner";

const Facebook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFacebookClick = async () => {
    // Prevent multiple clicks by checking if already loading
    if (loading) return;

    setLoading(true);
    const provider = new FacebookAuthProvider();
    const auth = getAuth(app);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch(`${urlServer}/api/auth/facebook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      localStorage.setItem("token", data.token);
      navigate("/");
      scrollToTop();
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      // Handle errors gracefully
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFacebookClick}
        disabled={loading} // Disable the button when loading
        className={`w-9 h-9 rounded-full ${
          loading ? "bg-gray-300" : "hover:bg-gray-400"
        }`}
        aria-disabled={loading}
      >
        {loading ? <LoadingSpinner /> : <FacebookIcon />}
      </button>
    </div>
  );
};

export default Facebook;
