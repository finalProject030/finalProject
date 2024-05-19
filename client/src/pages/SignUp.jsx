import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { urlServer } from "../variables";
import Facebook from "../components/Facebook";
import passwordValidator from "password-validator";

export default function signUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = new passwordValidator();
    schema
      .is()
      .min(8)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .oneOf(["Passw0rd", "Password123"]);

    // if (!schema.validate(formData.password)) {
    //   setError(
    //     "Password is not strong enough. It should contain at least 8 characters, including uppercase and lowercase letters, numbers, and special symbols. Avoid using common passwords like 'Passw0rd' or 'Password123'."
    //   );
    //   return;
    // }

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
    <div className="p-3 max-w-lg mx-auto  ">
      <h1 className="text-3xl text-center font-semibold my-7  ">SignUp</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg "
          id="username"
          onChange={handleChange}
        ></input>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg "
          id="email"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg "
          id="password"
          onChange={handleChange}
        ></input>
        <button
          disabled={loading}
          className=" bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 "
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
        <Facebook />
      </form>
      <div className=" flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className=" text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className=" text-red-500 mt-5">{error}</p>}
    </div>
  );
}
