import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/userSlice.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      dispatch(loginUser({ email }));
      setError("");
    } else {
      setError("User not found. Please sign up first.");
    }
  };

  useEffect(() => {
    // Adding console.log to debug if useEffect is running
    console.log("useEffect running with currentUser:", currentUser);
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="mx-auto max-w-md rounded-xl border px-4 py-20 text-gray-700 shadow-lg sm:px-8">
      <p className="mb-5 text-2xl font-medium text-center">
        Login To Explore Movies!
      </p>
      <div className="my-6">
        <div className="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
          <input
            required
            type="email"
            className="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <button
        className="mb-6 rounded-md bg-blue-600 px-8 py-1 font-medium text-white hover:bg-blue-700 w-full"
        onClick={handleLogin}
      >
        Login
      </button>
      <div className="flex justify-center">
        <span>
          Don't Have An Account?
          <Link to="/signup" className="ml-2 text-blue-600 hover:underline">
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
