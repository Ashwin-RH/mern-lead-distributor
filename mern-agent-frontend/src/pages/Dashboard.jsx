import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipboardCheck, HatGlasses } from "lucide-react";


const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ agentCount: 0, leadCount: 0 });


  useEffect(() => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  setUser(userData);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API}/api/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads:", err);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API}/api/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  fetchLeads();

  if (userData?.role === "admin") {
    fetchSummary();
  }
}, []);



  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
      toast.success("Lead deleted successfully!");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error("Failed to delete lead");
    }
  };

  // if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 bg-gradient-to-r from-violet-300 via-pink-200 to-indigo-300 min-h-screen">
      <h2 className="montserrat-bold text-2xl font-semibold mt-25  text-black/75 text-center">
        Welcome {user?.name} ({user?.role})
      </h2>

      {user?.role === "admin" && (
              <div className="flex items-center justify-center gap-30 mb-6 ">
        <div className="bg-white w-[10rem] p-6 rounded-lg mt-10 mb-6 shadow-xl shadow-black/25 flex items-center justify-between z-50">
        <div className="flex flex-col items-center gap-2">
          <HatGlasses size={40} />
          <h3 className="montserrat-medium text-md font-semibold text-gray-700">Agents</h3>
        </div>

        <div className="flex items-center justify-center   p-3  ">
          <p className="text-[45px] font-bold text-gray-800">{summary.agentCount}</p>
        </div>
      </div>

        <div className="bg-white w-[10rem] p-6 rounded-lg mt-10 mb-6 shadow-xl shadow-black/25 flex items-center justify-between z-50">
          <div className="flex flex-col items-center gap-2">
            <ClipboardCheck size={40} />
            <h3 className="montserrat-medium text-md font-semibold text-gray-700">Leads</h3>
          </div>

          <div className="flex items-center justify-center p-3">
            <p className="text-[45px] font-bold text-gray-800">{summary.leadCount}</p>
          </div>
        </div>
        </div>

)}
{/* <div>
      <h3 className="text-lg font-semibold text-gray-700">Leads</h3>
      <p className="text-2xl font-bold text-indigo-600">{summary.leadCount}</p>
    </div> */}


      <div className="overflow-x-auto  mt-10 mb-20 mx-10 p-6 bg-white rounded-lg shadow-xl shadow-black/25">
        <table className="w-full table-auto border border-gray-300 bg-gray-300/70 rounded-lg shadow">
          <thead className="montserrat-medium bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-4 py-2">Name</th>
              <th className="border border-gray-400 px-4 py-2">Phone</th>
              <th className="border border-gray-400 px-4 py-2">Notes</th>
              {user?.role === "admin" && (
                <>
                  <th className="border border-gray-400 px-4 py-2">Assigned Agent</th>
                  <th className="border border-gray-400 px-4 py-2">Actions</th>
                </>
              )}
              {user?.role !== "admin" && (
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => {
              console.log("Lead:", lead);
              return (
                <tr key={lead._id} className="montserrat-regular text-center text-gray-900">
                  <td className="border border-gray-400 px-4 py-2">{lead.firstName}</td>
                  <td className="border border-gray-400 px-4 py-2">{lead.mobile}</td>
                  <td className="border border-gray-400 px-4 py-2">{lead.notes}</td>
                  {user?.role === "admin" && (
                  <td className="border border-gray-400 px-4 py-2">
                    {lead.agent?.name || "—"}
                  </td>
                )}
                <td className="border border-gray-400 px-4 py-2">
                  {user?.role === "admin" ? (
                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this lead?")
                        ) {
                          handleDelete(lead._id);
                        }
                      }}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer transition duration-200"
                    >
                      Delete
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
