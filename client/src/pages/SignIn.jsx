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
import { scrollToTop } from "../variables";
import Box from "@mui/material/Box";
import LockResetIcon from '@mui/icons-material/LockReset';
import AddIcon from '@mui/icons-material/Add';



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
      scrollToTop();
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue-300 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full flex flex-row items-center gap-10">
        <div>
          <img
            src={logo3} // Logo image
            alt="Logo"
            className="w-52 h-52 mb-4 p-8 m-8 object-contain rounded-lg shadow-lg hidden sm:block"
          />
        </div>
        <div>
          <Box className="flex flex-col gap-4 w-full"
           sx={{
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "background.paper",
          }}>
            <h1 className="text-5xl text-center font-semibold mb-10">Sign In</h1>
            <form onSubmit={handleSubmit} >
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="border p-3 rounded-lg w-full mb-4" 
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="border p-3 rounded-lg w-full mb-4" 
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mb-10 w-full"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
            
          <div className="flex items-center justify-between w-full">
            <button 
            onClick={() => navigate("/forgot-password")} 
            type="button" 
            className="text-black-700 
            hover:underline">
              <LockResetIcon/>
              Forgot Password?
              </button>

              <button 
            onClick={() => navigate("/sign-up")}
            type="button" 
            className="text-black-700 
            hover:underline">
              <AddIcon/>
              Sign Up
              </button>
            </div>

            <div className="flex flex-col items-center text-center mt-6 w-full">
            <p> Or you can sign up with </p>
            <div className="flex gap-4 mt-4">
              <OAuth />
              <Facebook /> 
            </div>
            </div>
          </form>
          </Box>
          
          {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
      </div>
    </div>





  );
}
