import React, { useState } from "react";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { scrollToTop, urlServer } from "../variables";
import LoadingSpinner from "./LoadingSpinner";

const Facebook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFacebookClick = async () => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth(app);

    try {
      setLoading(true);
      // Trigger the popup directly from the user action
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Perform the subsequent actions after the popup is resolved
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
      console.error("Error in handleFacebookClick:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <a
          onClick={handleFacebookClick}
          role="button"
          data-icon="facebook"
          aria-disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
        >
          <svg viewBox="0 0 24 24" className="w-9 h-9 rounded-full">
            <path
              fillRule="evenodd"
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm2.52-14.923v1.686h-1.004c-.366 0-.613.077-.74.23-.128.153-.192.383-.192.69v1.207h1.871l-.249 1.891h-1.622v4.849h-1.955V12.78H9v-1.89h1.629V9.497c0-.792.221-1.407.664-1.843.443-.437 1.033-.655 1.77-.655.626 0 1.111.026 1.456.077z"
            ></path>
          </svg>
        </a>
      )}
    </div>
  );
};

export default Facebook;
