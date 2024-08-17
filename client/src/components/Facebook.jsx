import React, { useState } from "react";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Facebook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFacebookClick = async () => {
    if (loading) return; // Prevent multiple clicks

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
        disabled={loading} // Disable the button while loading
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: loading ? "#f0f0f0" : "#ffffff",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        aria-disabled={loading}
      >
        {loading ? <LoadingSpinner /> : "FB"}{" "}
        {/* Replace with actual icon if needed */}
      </button>
    </div>
  );
};

export default Facebook;
