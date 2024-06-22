import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { urlServer } from "../variables";
import Facebook from "../components/Facebook";

export default function SignUp() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setIsLengthValid(formData.password.length >= 10);
    setHasLowercase(/[a-z]/.test(formData.password));
    setHasSpecialChar(/[!@#?]/.test(formData.password));
    setPasswordsMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLengthValid || !hasLowercase || !hasSpecialChar || !passwordsMatch) {
      setError(
        "Password does not meet requirements or passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${urlServer}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="confirm password"
          className="border p-3 rounded-lg"
          id="confirmPassword"
          onChange={handleChange}
        />
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray">
          Password requirements:
        </h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-700">
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
          disabled={
            loading ||
            !isLengthValid ||
            !hasLowercase ||
            !hasSpecialChar ||
            !passwordsMatch
          }
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
        <Facebook />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
