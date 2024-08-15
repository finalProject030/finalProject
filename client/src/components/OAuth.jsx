import React, { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner"; // Import the LoadingSpinner component
import { scrollToTop, urlServer } from "../variables";
import GoogleIcon from '@mui/icons-material/Google';


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
      scrollToTop();

    } catch (error) {
      setLoading(false);
      console.log("could not sign in with google", error);
    } finally {
      setLoading(false); // Reset loading state after async operation
    }
  };

  return (
    <div>

      {loading ? (
        <LoadingSpinner /> // Render the loading spinner when loading
      ) : (

        <a
        onClick={handleGoogleClick}
        data-icon="google-c"
        role="button" // Add role attribute for accessibility
        aria-disabled={loading} // Set aria-disabled attribute for accessibility
      >
        <svg viewBox="0 0 24 24" className="w-9 h-9 rounded-full hover:bg-gray-400" >
        
          <path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm.044-5.213c2.445 0 4.267-1.551 4.556-3.781v-1.891h-4.519v1.89h2.602a2.893 2.893 0 0 1-2.724 1.93c-1.194 0-2.677-1.1-2.677-2.843 0-1.621 1.161-2.876 2.677-2.876.739 0 1.413.279 1.922.736l1.399-1.376a4.744 4.744 0 1 0-3.236 8.212z" />
        </svg>
      </a>
      


      )}



    </div>

  );
}
