import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import ScrollableTableServices from '../../../components/table/services_table'


// Icons
import SearchIcon from '@mui/icons-material/Search';

const Services = () => {

  // const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const [search, setSearch] = useState('');

  const [serviceManCount, setServiceManCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch API data using Axios  
  const fetchData = async () => {
    try {
      const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/one_app_get_each_service_count");

      console.log("API Response:", response);

      if (response.data && response.data['body-json'].statusCode === 200) {
        setServiceManCount(response.data['body-json'].body);
      } else if (response.data['body-json']['statusCode'] === 400) {
        notifyError(response.data['body-json'].body.message);
      } else {
        console.error("Unexpected response format:", response.data['body-json']);
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if(serviceManCount.length === 0){
      fetchData();
    }
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div className='px-6 bg-slate-100'>
        <div className=' flex h-14 justify-end items-center'>
          {/* Search */}
          <div className="flex items-center w-96 h-10 max-w-2xl bg-white shadow-md rounded-full px-4 py-2">
            <SearchIcon className="text-gray-400 mr-2" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search here..."
              className="bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none w-full"
            />
          </div>

          <div className='w-6'></div>

          {/* Add Member */}
          <Link to={"/manage_service_category"}>
            <button className="h-10 w-50 text-white bg-black text-md rounded-md px-6 py-2 font-medium">
              Manage Category
            </button>
          </Link>

          <div className='w-6'></div>

          {/* Add Member */}
          <Link to={"/add_service_man"}>
            <button className="h-10 w-50 text-white bg-black text-md rounded-md px-6 py-2 font-medium">
              Add Service Man
            </button>
          </Link>

        </div>

        {/* Service Categories */}
        <div className='grid grid-cols-4 gap-x-16 gap-y-4 mt-2 mb-4'>
          {serviceManCount.map((category) => (
            <div key={category.title} className={`flex flex-row h-20 bg-pink-200 items-center justify-start p-2 gap-3 rounded-md shadow-md`}>
              <div className="h-16 w-16 bg-black rounded-md text-white text-center items-center p-2 text-3xl">
                {/* Category Image */}
                <img
                  src={category.imageUrl}
                  alt="category"
                  className="w-16 h-12 rounded-sm"
                />
              </div>
              <div className='flex flex-col h-16 justify-between'>
                <div className="text-lg text-gray-600 font-serif">{category.title}</div>
                <div className="text-xl text-black font-semibold">{category.count}</div>
              </div>
            </div>
          ))}
        </div>

        <ScrollableTableServices />
      </div>
    </>
  )
}

export default Services