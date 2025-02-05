import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollableTableEProduct from '../../../components/table/e_product_table'

// Icons
import SearchIcon from '@mui/icons-material/Search';

const Eproducts = () => {

  const [search, setSearch] = useState('');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

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
          <Link to={"/ecom_add_product"}>
            <button className="h-10 w-50 text-white bg-black text-md rounded-md px-6 py-2 font-medium">
              Add Products
            </button>
          </Link>

        </div>
        <ScrollableTableEProduct />
      </div>
    </>
  )
}

export default Eproducts