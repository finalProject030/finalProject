import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call your API to send a password reset email
      // Example:
      // const res = await fetch(`${urlServer}/api/auth/forgot-password`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await res.json();

      // Simulating API call with setTimeout
      setTimeout(() => {
        setMessage("Password reset instructions sent to your email.");
        setLoading(false);
      }, 2000);
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue-300 min-h-screen flex flex-col justify-center items-center">
      <div className="p-3 max-w-xl mx-auto w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl text-center font-semibold my-7">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-3 rounded-lg"
            value={email}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>
        {message && <p className="text-blue-700 mt-5">{message}</p>}
        <div className="flex justify-between items-center mt-5">
          <Link to={"/sign-in"}>
            <span className="text-blue-700">Back to Sign In</span>
          </Link>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
