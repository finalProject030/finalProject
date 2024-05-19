import React, { useEffect } from "react";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { urlServer } from "../variables";

const Facebook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the redirect result when the component mounts
    const handleRedirectResult = async () => {
      try {
        const auth = getAuth(app);
        // You don't need to handle redirect result here if you're using popup authentication
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };

    handleRedirectResult(); // Call the function to handle redirect result
  }, []); // Run this effect only once when the component mounts

  const handleFacebookClick = async () => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth(app);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Call your backend API with user data
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
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      // Handle errors gracefully and provide user feedback
    }
  };

  return (
    <button
      onClick={handleFacebookClick}
      type="button"
      className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Facebook
    </button>
  );
};

export default Facebook;
