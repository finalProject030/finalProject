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
      className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2"
    >
      <svg
        className="w-4 h-4 me-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 8 19"
      >
        <path
          fillRule="evenodd"
          d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
          clipRule="evenodd"
        />
      </svg>
      Continue with Facebook
    </button>
  );
};

export default Facebook;
