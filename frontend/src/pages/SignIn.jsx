import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data));
      localStorage.setItem("user", JSON.stringify(result.data)); // 🔥 persist login

      setErr("");
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: result.user.email },
        { withCredentials: true },
      );

      dispatch(setUserData(data));
      localStorage.setItem("user", JSON.stringify(data)); // 🔥 persist login
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border">
        <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Vingo</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="absolute right-3 top-3"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-[#ff4d2d] text-white py-2 rounded-lg"
        >
          {loading ? <ClipLoader size={18} color="white" /> : "Sign In"}
        </button>

        {err && <p className="text-red-500 text-center mt-2">{err}</p>}

        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg py-2"
        >
          <FcGoogle /> Sign In with Google
        </button>

        <p
          className="text-center mt-4 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Create account
        </p>
      </div>
    </div>
  );
}

export default SignIn;
