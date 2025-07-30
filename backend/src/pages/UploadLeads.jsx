import { useState } from "react";
import axios from "axios";

const UploadLeads = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMsg(`✅ ${res.data.msg} (${res.data.total} leads)`);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Upload failed");
      setMsg("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-violet-300 via-pink-200 to-indigo-300 ">
    <div className="max-w-md mx-auto mt-10 p-9 bg-white rounded-lg shadow-xl shadow-black/25">
      <h2 className="montserrat-semibold text-xl font-semibold mb-4">Upload CSV of Leads</h2>
      {msg && <p className="montserrat-regular text-[15px] text-green-600 mb-2">{msg}</p>}
      {error && <p className="montserrat-regular text-[15px] text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="montserrat-regular text-sm w-full bg-gray-300/70 p-2 rounded-lg outline-2 outline-violet-300 hover:outline-violet-400/80 hover:shadow-md hover:shadow-violet-300 transition-all duration-300 ease-in-out cursor-pointer"
          required
        />
        <button
          type="submit"
          className="montserrat-medium w-full bg-gradient-to-r from-violet-500 via-pink-400 to-indigo-500 bg-[length:200%_100%] bg-[position:-50%_5] text-white py-2 rounded-lg hover:bg-violet-500 cursor-pointer transition-all duration-300 ease-in-out shadow-md shadow-violet-300/50 active:scale-95 hover:shadow-lg hover:shadow-violet-400/50 transform-gpu"
        >
          Upload & Distribute
        </button>
      </form>
    </div>
    </div>
  );
};

export default UploadLeads;
