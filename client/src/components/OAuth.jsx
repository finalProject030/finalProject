import React, { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner"; // Import the LoadingSpinner component
import { urlServer } from "../variables";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleGoogleClick = async () => {
    try {
      setLoading(true); // Set loading state to true before async operation
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      // console.log(result);

      const res = await fetch(`${urlServer}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    } finally {
      setLoading(false); // Reset loading state after async operation
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={loading} // Disable the button while loading
      className={`text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2 ${
        loading && "opacity-50 cursor-not-allowed"
      }`} // Add conditional class for styling when loading
    >
      {loading ? (
        <LoadingSpinner /> // Render the loading spinner when loading
      ) : (
        <>
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path
              fillRule="evenodd"
              d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
              clipRule="evenodd"
            />
          </svg>
          Sign in with Google
        </>
      )}
    </button>
  );
}
