// src/components/Navbar.jsx
import { Ellipsis, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout(); 
    navigate('/login');
  };

  return (
    <nav className="fixed mt-5 w-[20rem] md:w-[50rem] left-1/2 -translate-x-1/2 z-60 bg-black/50 text-white border border-gray-500 px-7 py-3 shadow  items-center backdrop-blur-sm rounded-xl shadow-2xl shadow-violet-400 overflow-hidden">
      <div className='flex justify-between items-center'>
      <Link to="/" className=" montserrat-medium tracking-wider leading-relaxed text-xl font-bold text-white">Azyn</Link>

      <div className="hidden md:flex  gap-4 items-center">
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
      </div>

      <div className='md:hidden bg-gray-500/40 absolute top-3.5 right-7 rounded-full hover:bg-gray-400/60 transition duration-200'>
        <button onClick={() => setIsOpen(!isOpen)} className='flex items-center justify-center p-1 cursor-pointer'>
          {isOpen ? <X size={23} /> : <Ellipsis size={23} />}
        </button>
      </div>

      {isOpen && (
        <div className='md:hidden mt-2 bg-black/40 backdrop-blur-lg rounded-lg border border-gray-400 shadow-lg flex flex-col gap-3 p-4 z-50'>
          {user.role === 'admin' && (
            <>
              <Link to='/add-agent' className='montserrat-regular hover:text-pink-200'>Add Agent</Link>
              <Link to='/upload-leads' className='montserrat-regular hover:text-pink-200'>Upload Leads</Link>
            </>
          )}
          <Link to='/leads' className='montserrat-regular hover:text-pink-200'>My Leads</Link>
          <button 
          onClick={handleLogout}
          className='montserrat-medium border-2 border-white text-white bg-red-500 hover:text-white px-3 py-1 rounded-lg text-sm transition cursor-pointer'>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
