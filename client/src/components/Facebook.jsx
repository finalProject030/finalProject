import React, { useState } from "react";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { scrollToTop, urlServer } from "../variables";
import FacebookIcon from '@mui/icons-material/Facebook';
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
    // <button
    //   onClick={handleFacebookClick}
    //   type="button"
    //   disabled={loading}
    //   className={`text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2 ${
    //     loading ? "opacity-50 cursor-not-allowed" : ""
    //   }`}
    // >
    //   <FacebookIcon />
    //   {loading ? (
    //     <svg
    //       className="animate-spin h-5 w-5 mr-3"
    //       xmlns="http://www.w3.org/2000/svg"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //     >
    //       <circle
    //         className="opacity-25"
    //         cx="12"
    //         cy="12"
    //         r="10"
    //         stroke="currentColor"
    //         strokeWidth="4"
    //       ></circle>
    //       <path
    //         className="opacity-75"
    //         fill="currentColor"
    //         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20v4c4.418 0 8-3.582 8-8h-4c0 2.21-.898 4.21-2.351 5.657L12 20zm0-20l-3 2.647A7.962 7.962 0 014 12h4c0-3.042 1.135-5.824 3-7.938L12 0z"
    //       ></path>
    //     </svg>
    //   ) : (
    //     <svg
    //       className="w-4 h-4 me-2"
    //       aria-hidden="true"
    //       xmlns="http://www.w3.org/2000/svg"
    //       fill="currentColor"
    //       viewBox="0 0 8 19"
    //     >
    //       <path
    //         fillRule="evenodd"
    //         d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
    //         clipRule="evenodd"
    //       />
    //     </svg>
    //   )}
    //   {loading ? "Signing In..." : "Continue with Facebook"}
    // </button>



<div>

{loading ? (
  <LoadingSpinner /> // Render the loading spinner when loading
) : (
<a
onClick={handleFacebookClick}
role="button" // Add role attribute for accessibility
data-icon="facebook"
>
  <svg viewBox="0 0 24 24" 
  className="w-9 h-9 rounded-full hover:bg-gray-400" >
    <path fill-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm2.52-14.923v1.686h-1.004c-.366 0-.613.077-.74.23-.128.153-.192.383-.192.69v1.207h1.871l-.249 1.891h-1.622v4.849h-1.955V12.78H9v-1.89h1.629V9.497c0-.792.221-1.407.664-1.843.443-.437 1.033-.655 1.77-.655.626 0 1.111.026 1.456.077z">
      </path>
      </svg>
      </a>

  )}
  </div>
  )

};

export default Facebook;
