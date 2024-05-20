import { useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/auth/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Password has been reset successfully");
      } else {
        setMessage(
          data.message || "Password reset failed. Please try again later."
        );
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }

    setLoading(false);
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
          <button
            type="submit"
            className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={
              loading || password !== confirmPassword || password.length < 8
            }
          >
            {loading ? <LoadingSpinner /> : "Reset Password"}
          </button>
        </form>
        {message && <p className="text-blue-700 mt-5">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
