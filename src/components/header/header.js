import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import logo from '../../assets/images/logo1.png';
import person from '../../assets/images/person male.png';

function Header({ setIsAuthenticated }) {

  const notify = (message) => toast(message);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);
    navigate("/admin_login");
  };

  /// Fetch Profile Data
  const fetchProfile = useCallback(async () => {
    const email = localStorage.getItem('adminEmail');

    if (!email) return;

    try {
      const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/admin_profile", { adminEmail: email });

      console.log("API Response:", response.data);

      if (response.data?.['body-json']?.statusCode === 200) {
        setProfileData(response.data['body-json'].body.admin);
      } else if (response.data?.['body-json']?.statusCode === 400) {
        notify(response.data['body-json'].body.message);
      } else {
        console.error("Unexpected response format:", response.data);
        throw new Error("Failed to fetch profile data");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, []); // useCallback ensures the function reference does not change

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // No warning now!

  return (
    <div className="flex h-20 w-full bg-slate-100 border-slate-300 border-b-2 items-center justify-between px-10">
      {/* Logo */}
      <Link to={'/'}>
        <img src={logo} alt="logo" className="w-30 h-14 rounded-sm" />
      </Link>

      {/* Search Bar */}
      <div className="flex items-center w-full max-w-2xl bg-white shadow-md rounded-full px-4 py-2">
        <SearchIcon className="text-gray-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search here..."
          className="bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none w-full"
        />
      </div>

      {/* Admin Section */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <div className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-300">
          <NotificationsNoneIcon className="text-gray-500" />
        </div>

        {/* Admin Info */}
        <div className="flex items-center space-x-3">
          <img src={person} alt="Admin" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-gray-700 font-medium">{profileData?.name || 'Admin'}</p>
            <button onClick={handleLogout} className="text-red-500 text-sm font-medium hover:underline">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;