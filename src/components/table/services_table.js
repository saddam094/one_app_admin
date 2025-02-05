import React from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

const ScrollableTableServices = () => {
  const data = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    phone: '62*****771',
    email: `example${index + 1}@gmail.com`,
    category: 'Mechanical Services',
    subCategory: 'heavy vehicle',
    storeName: `shop ${index + 1}`,
    experience:'5+',
    joiningDate: '15-01-2025',
    address: `Address ${index % 5 + 1}`,
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">C Name</th>
              <th className="px-4 py-2 border">C Number</th>
              <th className="px-4 py-2 border">C Email</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Sub-Category</th>
              <th className="px-4 py-2 border">Store Name</th>
              <th className="px-4 py-2 border">Experience</th>
              <th className="px-4 py-2 border">Joining Date</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.id}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.phone}</td>
                <td className="px-4 py-2 border">{item.email}</td>
                <td className="px-4 py-2 border">{item.category}</td>
                <td className="px-4 py-2 border">{item.subCategory}</td>
                <td className="px-4 py-2 border">{item.storeName}</td>
                <td className="px-4 py-2 border">{item.experience}</td>
                <td className="px-4 py-2 border">{item.joiningDate}</td>
                <td className="px-4 py-2 border">{item.address}</td>
                <td className="px-4 py-2 border flex justify-evenly">
                    {/* Eye */}
                    <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                        <RemoveRedEyeIcon />
                    </div>

                    {/* Delete */}
                    <div className="h-8 w-8 bg-red-200 rounded-sm text-red-800 text-sm text-center p-1">
                        <DeleteIcon />
                    </div>

                    {/* More */}
                    {/* <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                        <MoreVertIcon />
                    </div> */}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default ScrollableTableServices;
