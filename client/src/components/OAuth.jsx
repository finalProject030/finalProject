import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { urlServer } from "../variables";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the redirect result when the component mounts
    const handleRedirectResult = async () => {
      try {
        const auth = getAuth(app);
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          // User successfully signed in
          const res = await fetch(`{${urlServer}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL,
            }),
          });
          const data = await res.json();
          dispatch(signInSuccess(data));
          navigate("/");
        } else {
          // No user signed in, or sign-in failed
          console.log("Sign-in failed or no user signed in");
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };

    handleRedirectResult(); // Call the function to handle redirect result
  }, []); // Run this effect only once when the component mounts

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Initiate sign-in with redirect
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
