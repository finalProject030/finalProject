import React, { useState } from "react";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { scrollToTop, urlServer } from "../variables";
import FacebookIcon from "@mui/icons-material/Facebook";
import LoadingSpinner from "./LoadingSpinner"; // Import the LoadingSpinner component

const Facebook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFacebookClick = async () => {
    setLoading(true);
    const provider = new FacebookAuthProvider();
    const auth = getAuth(app);

    try {
      const result = await new Promise((resolve, reject) => {
        signInWithPopup(auth, provider)
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });

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
      // Handle errors gracefully and provide user feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner /> // Render the loading spinner when loading
      ) : (
        <a
          onClick={handleFacebookClick}
          role="button" // Add role attribute for accessibility
          data-icon="facebook"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-9 h-9 rounded-full hover:bg-gray-400"
          >
            <path
              fill-rule="evenodd"
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm2.52-14.923v1.686h-1.004c-.366 0-.613.077-.74.23-.128.153-.192.383-.192.69v1.207h1.871l-.249 1.891h-1.622v4.849h-1.955V12.78H9v-1.89h1.629V9.497c0-.792.221-1.407.664-1.843.443-.437 1.033-.655 1.77-.655.626 0 1.111.026 1.456.077z"
            ></path>
          </svg>
        </a>
      )}
    </div>
  );
};

export default Facebook;
