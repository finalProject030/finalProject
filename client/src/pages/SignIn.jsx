import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { urlServer } from "../variables";
import Facebook from "../components/Facebook";
import logo3 from "../../assets/logo3.png";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch(`${urlServer}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      localStorage.setItem("token", data.token);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue-300 min-h-screen flex items-center justify-center">
      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full flex flex-row items-center">
        <div>
          <img
            src={logo3} // Logo image
            alt="Logo"
            className="w-52 h-52 mb-4 p-8 m-8 object-contain rounded-lg shadow-lg hidden sm:block"
          />
        </div>
        <div>
          <h1 className="text-3xl text-center font-semibold mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg w-full"
              id="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-3 rounded-lg w-full"
              id="password"
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
            <OAuth />
            <Facebook />
          </form>
          <div className="flex justify-between items-center mt-5 w-full">
            <Link to={"/forgot-password"}>
              <span className="text-blue-700 hover:underline">
                Forgot Password?
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-gray-700">Don't have an account?</p>
              <Link to={"/sign-up"}>
                <span className="text-blue-700 hover:underline">Sign Up</span>
              </Link>
            </div>
          </div>

          {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
      </div>
    </div>
  );
}
