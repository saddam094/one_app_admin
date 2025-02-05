// import React from 'react'
// import BigCard from '../../../components/card/big_card'
// import RevenueGraph from '../../../components/graph/revenue_graph'
// import ScrollableTable from '../../../components/table/e_com_table';

// // Icons
// import VaccinesIcon from '@mui/icons-material/Vaccines';
// import MovieCreationIcon from '@mui/icons-material/MovieCreation';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
// import AddBusinessIcon from '@mui/icons-material/AddBusiness';
// import ApartmentIcon from '@mui/icons-material/Apartment';

// const SmallCard = ({title, counts, Icon}) => {
//     return (
//         <div className="flex h-20 w-full bg-pink-200 p-2 rounded-lg shadow-md space-x-4">
//             <div className='h-16 w-16 bg-black rounded-md text-center p-4'>
//                 <Icon  className='text-white text-xl'/>
//             </div>
//             <div className='flex flex-col justify-between'>
//                 <h3 className="text-md font-serif">{title}</h3>
//                 <p className="text-xl font-bold">{counts}</p>
//             </div>
//         </div>
//       )
// }

// const dashboard = () => {
//   return (
//     <>
//         <div className='px-8 py-6 bg-slate-100'>
//             {/* Cards and Graph */}
//             <div className='flex space-x-10'>

//                 <div className='flex flex-col space-y-6'>
//                     {/* Big Cards */}
//                     <div className='flex space-x-6'>
//                         <BigCard title={'Total Registration This Month'} subTitle={'Number Of New Members'} counts={'10000'}/>
//                         <BigCard title={'Total Revenue'} subTitle={'Summary Of Monthly Revenue'} counts={'1000000'}/>
//                         <BigCard title={'Total Users This Month'} subTitle={'Number Of New Users This Month'} counts={'100000'}/>
//                     </div>

//                     {/* Graph */}
//                     <div className="lg:col-span-3">
//                       <RevenueGraph />
//                     </div>
//                 </div>

//                 {/* small cards */}
//                 <div className="w-96 space-y-3 bg-white rounded-lg p-3">
//                     <SmallCard title={'Total Doctors'} counts={'10000'} Icon={VaccinesIcon} />
//                     <SmallCard title={'Total Leisure'} counts={'10000'} Icon={MovieCreationIcon} />
//                     <SmallCard title={'Total Service Man'} counts={'10000'} Icon={ManageAccountsIcon} />
//                     <SmallCard title={'Total Cab Drivers'} counts={'10000'} Icon={LocalTaxiIcon} />
//                     <SmallCard title={'Total E-com Stores'} counts={'10000'} Icon={AddBusinessIcon} />
//                     <SmallCard title={'Total Real State Agent'} counts={'10000'} Icon={ApartmentIcon} />
//                 </div>
//             </div>
            
//             {/* space */}
//             <div className='h-6 w-full'>

//             </div>

//             {/* Table */}
//             <div>
//                 <ScrollableTable />
//             </div>
//         </div>
//     </>
//   )
// }

// export default dashboard


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BigCard from '../../../components/card/big_card';
import RevenueGraph from '../../../components/graph/revenue_graph';
import ScrollableTable from '../../../components/table/e_com_table';

// Icons
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ApartmentIcon from '@mui/icons-material/Apartment';

const SmallCard = ({ title, counts, Icon }) => {
  return (
    <div className="flex h-20 w-full bg-pink-200 p-2 rounded-lg shadow-md space-x-4">
      <div className='h-16 w-16 bg-black rounded-md text-center p-4'>
        <Icon className='text-white text-xl' />
      </div>
      <div className='flex flex-col justify-between'>
        <h3 className="text-md font-serif">{title}</h3>
        <p className="text-xl font-bold">{counts}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRegistrations: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalDoctors: 0,
    totalLeisure: 0,
    totalServiceMan: 0,
    totalCabDrivers: 0,
    totalEcomStores: 0,
    totalRealEstateAgents: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/one_app_admin_dashboard_table_items_count');
        const data = response.data['body-json']['body']; // Assuming API returns an object with relevant fields
        // console.log(data);


        setDashboardData({
          totalRegistrations: data['totalRegistration'] || 0,
          totalRevenue: data['totalRevenue'] || '00.00',
          totalUsers: data['totalUser'] || 0,
          totalDoctors: data['totalDoctor'] || 0,
          totalLeisure: data['totalLeisure'] || 0,
          totalServiceMan: data['totalServiceMan'] || 0,
          totalCabDrivers: data['totalCabDriver'] || 0,
          totalEcomStores: data['totalEcomStore'] || 0,
          totalRealEstateAgents: data['totalRealStateAgent'] || 0
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='px-8 py-6 bg-slate-100'>
        {/* Cards and Graph */}
        <div className='flex space-x-10'>

          <div className='flex flex-col space-y-6'>
            {/* Big Cards */}
            <div className='flex space-x-6'>
              <BigCard title={'Total Registration This Month'} subTitle={'Number Of New Members'} counts={dashboardData.totalRegistrations} />
              <BigCard title={'Total Revenue'} subTitle={'Summary Of Monthly Revenue'} counts={dashboardData.totalRevenue} />
              <BigCard title={'Total Users This Month'} subTitle={'Number Of New Users This Month'} counts={dashboardData.totalUsers} />
            </div>

            {/* Graph */}
            <div className="lg:col-span-3">
              <RevenueGraph />
            </div>
          </div>

          {/* Small cards */}
          <div className="w-96 space-y-3 bg-white rounded-lg p-3">
            <SmallCard title={'Total Doctors'} counts={dashboardData.totalDoctors} Icon={VaccinesIcon} />
            <SmallCard title={'Total Leisure'} counts={dashboardData.totalLeisure} Icon={MovieCreationIcon} />
            <SmallCard title={'Total Service Man'} counts={dashboardData.totalServiceMan} Icon={ManageAccountsIcon} />
            <SmallCard title={'Total Cab Drivers'} counts={dashboardData.totalCabDrivers} Icon={LocalTaxiIcon} />
            <SmallCard title={'Total E-com Stores'} counts={dashboardData.totalEcomStores} Icon={AddBusinessIcon} />
            <SmallCard title={'Total Real Estate Agents'} counts={dashboardData.totalRealEstateAgents} Icon={ApartmentIcon} />
          </div>
        </div>

        {/* Space */}
        <div className='h-6 w-full'></div>

        {/* Table */}
        <div>
          <ScrollableTable />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
