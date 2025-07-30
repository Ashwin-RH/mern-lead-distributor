import { useState } from "react";
import axios from "axios";

const AddAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "agent",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  console.log("Submitting Agent:", formData); // 🔍 DEBUG HERE

  try {
    const res = await axios.post("http://localhost:5000/api/agents", formData, {
      headers: {
        "Content-Type": "application/json", // 👈 IMPORTANT
        Authorization: `Bearer ${token}`,
      },
    });

    setMsg(res.data.msg);
    setError("");
    setFormData({ name: "", email: "", mobile: "", password: "", role: "agent" });
  } catch (err) {
    console.error("❌ Agent submit error:", err.response?.data);
    setError(err.response?.data?.msg || "Error occurred");
    setMsg("");
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-violet-300 via-pink-200 to-indigo-300 p-6">
    <div className="max-w-md mx-auto mt-10 p-10 bg-white shadow-xl shadow-black/25 rounded-xl">
      <h2 className="montserrat-semibold pl-1 text-xl font-semibold mb-4">Add New Agent</h2>
      {msg && <p className="text-green-600 mb-2">{msg}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="text-sm text-gray-700 montserrat-medium w-full  bg-gray-300/70 placeholder:text-sm placeholder-gray-500/60 placeholder:p-1 py-2 px-2 rounded-lg outline-2 outline-violet-300 focus:outline-violet-400/80 focus:shadow-md focus:shadow-violet-300 transition-all duration-300 ease-in-out"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="text-sm text-gray-700 montserrat-medium w-full  bg-gray-300/70 placeholder:text-sm placeholder-gray-500/60 placeholder:p-1 py-2 px-2 rounded-lg outline-2 outline-violet-300 focus:outline-violet-400/80 focus:shadow-md focus:shadow-violet-300 transition-all duration-300 ease-in-out"
          required
        />
        <input
          name="mobile"
          type="text"
          placeholder="+91 ..."
          value={formData.mobile}
          onChange={handleChange}
          className="text-sm text-gray-700 montserrat-medium w-full  bg-gray-300/70 placeholder:text-sm placeholder-gray-500/60 placeholder:p-1 py-2 px-2 rounded-lg outline-2 outline-violet-300 focus:outline-violet-400/80 focus:shadow-md focus:shadow-violet-300 transition-all duration-300 ease-in-out"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="text-sm text-gray-700 montserrat-medium w-full  bg-gray-300/70 placeholder:text-sm placeholder-gray-500/60 placeholder:p-1 py-2 px-2 rounded-lg outline-2 outline-violet-300 focus:outline-violet-400/80 focus:shadow-md focus:shadow-violet-300 transition-all duration-300 ease-in-out"
          required
        />
        <button
          type="submit"
          className="montserrat-medium w-full bg-gradient-to-r from-violet-500 via-pink-400 to-indigo-500 bg-[length:200%_100%] bg-[position:-50%_5] text-white py-2 rounded-lg hover:bg-violet-500 cursor-pointer transition-all duration-300 ease-in-out shadow-md shadow-violet-300/50 active:scale-95 hover:shadow-lg hover:shadow-violet-400/50"
        >
          Add Agent
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddAgent;
