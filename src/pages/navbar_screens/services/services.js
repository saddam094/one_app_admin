import React, { useState } from 'react'
import ScrollableTableServices from '../../../components/table/services_table'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// Icons
import SearchIcon from '@mui/icons-material/Search';

const Services = () => {

  const [search, setSearch] = useState('');
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // const category = [
  //   {
  //     title: 'Mechanical Service',
  //     counts: '1000',
  //     Icon: {ManageAccountsIcon}
  //   },
  //   {
  //     title: 'Plumbing Service',
  //     counts: '10',
  //     Icon: {ManageAccountsIcon}
  //   },
  //   {
  //     title: 'Electrical Service',
  //     counts: '1000',
  //     Icon: {ManageAccountsIcon}
  //   },
  //   {
  //     title: 'Painting Service',
  //     counts: '10',
  //     Icon: {ManageAccountsIcon}
  //   },
  //   {
  //     title: 'Carpentry Service',
  //     counts: '100',
  //     Icon: {ManageAccountsIcon}
  //   },
  //   {
  //     title: 'HVAC Service',
  //     counts: '1000',
  //     Icon: {ManageAccountsIcon}
  //   },
  //   {
  //     title: 'Cleaning Service',
  //     counts: '10',
  //     Icon: {ManageAccountsIcon}
  //   },
  //   {
  //     title: 'Technician Service',
  //     counts: '100',
  //     Icon: {ManageAccountsIcon}
  //   },
  // ];

  const services = [
    {name: "Mechnical Service", counts: 1000},
    {name: "Plumbing Service", counts: 10},
    {name: "Electrical Service", counts: 1500},
    {name: "Painting Service", counts: 500},
    {name: "Carpentry Service", counts: 900},
    {name: "HVAC Service", counts: 100},
    {name: "Cleaning Service", counts: 1500},
    {name: "Technician Service", counts: 1500},
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
            Add Member
          </button>

        </div>

        {/* Service Categories */}
        <div className='grid grid-cols-4 gap-x-16 gap-y-4 mt-2 mb-4'>
          {services.map((service) => (
            <div className={`flex flex-row h-20 bg-pink-200 items-center justify-start p-2 gap-3 rounded-md shadow-md`}>
              <div className="h-16 w-16 bg-black rounded-md text-white text-center items-center p-2 text-3xl">
                <ManageAccountsIcon />
              </div>
              <div className='flex flex-col h-16 justify-between'>
                <div className="text-lg text-gray-600 font-serif">{service.name}</div>
                <div className="text-xl text-black font-semibold">{service.counts}</div>
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