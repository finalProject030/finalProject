import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { urlServer } from "../variables";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    console.log("Token from URL:", token);
  }, [token]);

  useEffect(() => {
    setIsLengthValid(password.length >= 10);
    setHasLowercase(/[a-z]/.test(password));
    setHasSpecialChar(/[!@#?]/.test(password));
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting password reset");

    try {
      const res = await fetch(`${urlServer}/api/auth/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      console.log("Fetch response status:", res.status);

      const data = await res.json();
      console.log("Fetch response data:", data);

      if (res.ok) {
        setMessage("Password has been reset successfully");
      } else {
        setMessage(
          data.message || "Password reset failed. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue-300 min-h-screen flex flex-col justify-center items-center">
      <div className="p-3 max-w-xl mx-auto w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl text-center font-semibold my-7">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="border p-3 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Password requirements:
          </h2>
          <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
            <li className="flex items-center">
              <svg
                className={`w-3.5 h-3.5 me-2 ${
                  isLengthValid
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                } flex-shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              At least 10 characters
            </li>
            <li className="flex items-center">
              <svg
                className={`w-3.5 h-3.5 me-2 ${
                  hasLowercase
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                } flex-shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              At least one lowercase character
            </li>
            <li className="flex items-center">
              <svg
                className={`w-3.5 h-3.5 me-2 ${
                  hasSpecialChar
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                } flex-shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              At least one special character, e.g., ! @ # ?
            </li>
          </ul>
          <button
            type="submit"
            className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={
              !isLengthValid ||
              !hasLowercase ||
              !hasSpecialChar ||
              !passwordsMatch
            }
          >
            Reset Password
          </button>
        </form>
        {message && <p className="text-blue-700 mt-5">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
