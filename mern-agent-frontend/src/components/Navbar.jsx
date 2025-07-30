// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout(); 
    navigate('/login');
  };

  return (
    <nav className="fixed mt-5 w-[20rem] md:w-[50rem] left-1/2 -translate-x-1/2 z-60 bg-black/50 text-white border border-gray-500 px-7 py-3 shadow flex justify-between items-center backdrop-blur-sm rounded-xl shadow-2xl shadow-violet-400 overflow-hidden">
      <Link to="/" className="montserrat-medium tracking-wider leading-relaxed text-xl font-bold text-white">Azyn</Link>

      <div className="flex gap-4 items-center">
        {user?.role === 'admin' && (
          <>
            <Link to="/add-agent" className="montserrat-regular hover:text-pink-200">Add Agent</Link>
            <Link to="/upload-leads" className="montserrat-regular hover:text-pink-200">Upload Leads</Link>
          </>
        )}
        <Link to="/leads" className="montserrat-regular hover:text-pink-200">My Leads</Link>
        <button
          onClick={handleLogout}
          className="montserrat-medium border-2 border-white text-white hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg text-sm transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
