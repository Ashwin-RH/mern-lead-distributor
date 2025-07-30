import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      console.log("✅ Login response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user); // ✅ passed down from App.jsx
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      setMsg(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-300 via-pink-200 to-indigo-300 bg-[length:200%_100%] bg-[position:-50%_5]">
      <form
        className="bg-white px-9 py-8 rounded-3xl shadow-xl shadow-black/25 w-80"
        onSubmit={handleLogin}
      >
        <h2 className="montserrat-semibold text-xl font-bold mb-8 text-center">Login</h2>
        {msg && <p className="text-right text-red-500 mb-2 text-sm">{msg}</p>}
        <div className="flex items-center justify-center rounded-lg mb-4 p-2 gap-2 bg-gray-200">
          <User size={22} className="text-gray-700" />
          <input
            type="email"
            placeholder="Email here.."
            className="montserrat-medium text-sm w-full placeholder:text-sm placeholder-gray-500/60 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center justify-center rounded-lg mb-4 p-2 gap-2 bg-gray-200">
          <Lock size={22} className="text-gray-700" />
          <input
            type="password"
            placeholder="Your password here.."
            className="text-sm montserrat-medium font-weight-300 w-full placeholder:text-sm placeholder-gray-500/60 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center mt-5">
          <button
            type="submit"
            className="montserrat-semibold border-2 border-gray-200 bg-gray-300 text-sm text-gray-600 hover:text-white px-8 py-2 rounded-xl hover:bg-gradient-to-br from-black via-black/80 to-black cursor-pointer duration-500 transition-all transform-gpu active:scale-95 hover:scale-102"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
