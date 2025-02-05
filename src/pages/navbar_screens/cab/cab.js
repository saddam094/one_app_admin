import React, { useState } from 'react'
import ScrollableTableCab from '../../../components/table/cab_table'

// Icons
import SearchIcon from '@mui/icons-material/Search';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';

const Cab = () => {

  const [search, setSearch] = useState('');
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const cabCategory = [
    {name: "Total Vehicle", counts: 1000},
    {name: "Mini", counts: 150},
    {name: "Sedan", counts: 350},
    {name: "SUV", counts: 500}
  ];
  
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
          <button className="h-10 w-50 text-white bg-black text-md rounded-md px-6 py-2 font-medium">
            Add Driver
          </button>

        </div>

        {/* Doctor Categories */}
        <div className='grid grid-cols-4 gap-x-16 gap-y-4 mt-2 mb-4'>
          {cabCategory.map((category) => (
            <div className={`flex flex-row h-20 bg-pink-200 items-center justify-start p-2 gap-3 rounded-md shadow-md`}>
              <div className="h-16 w-16 bg-black rounded-md text-white text-center items-center p-2 text-3xl">
                <LocalTaxiIcon />
              </div>
              <div className='flex flex-col h-16 justify-between'>
                <div className="text-lg text-gray-600 font-serif">{category.name}</div>
                <div className="text-xl text-black font-semibold">{category.counts}</div>
              </div>
            </div>
          ))}
        </div>

        <ScrollableTableCab />
      </div>
    </>
  )
}

export default Cab