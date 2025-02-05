import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import logo from '../../assets/images/logo.png';
import person from '../../assets/images/person male.png'

function Header() {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="flex h-20 w-full bg-slate-100 border-slate-300 border-b-2 items-center justify-between px-10">
        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          className="w-32 h-10 rounded-sm"
        />

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
          <img
            src={person}
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-gray-700 font-medium">Login As Admin</p>
            <button className="text-red-500 text-sm font-medium hover:underline">
              Logout
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Header;
