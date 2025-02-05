import React from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from "react-router-dom";

const ScrollableTable = () => {
  const data = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    phone: '62*****771',
    email: `example${index + 1}@gmail.com`,
    gst: '62025486202548',
    store: `shop ${index + 1}`,
    totalProduct: `${index+1 * 10}`,
    regDate: '15-01-2025',
    address: `Address ${index % 5 + 1}`,
    status: `${index % 2 === 0 ? 'true' : 'false'}`
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
              <th className="px-4 py-2 border">GST No</th>
              <th className="px-4 py-2 border">Store Name</th>
              <th className="px-4 py-2 border">Total Products</th>
              <th className="px-4 py-2 border">Reg Date</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Status</th>
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
                <td className="px-4 py-2 border">{item.gst}</td>
                <td className="px-4 py-2 border">{item.store}</td>
                <td className="px-4 py-2 border">{item.totalProduct}</td>
                <td className="px-4 py-2 border">{item.regDate}</td>
                <td className="px-4 py-2 border">{item.address}</td>
                <td className={`px-4 py-2 border ${item.status === 'true' ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>{item.status === 'true' ? 'Active': 'Inactive'}</td>
                <td className="px-4 py-2 border flex justify-evenly">
                  {/* Eye */}
                  <Link to={"/ecom_update"}>
                    <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                      <RemoveRedEyeIcon />
                    </div>
                  </Link>

                  {/* Delete */}
                  <div className="h-8 w-8 bg-red-200 rounded-sm text-red-800 text-sm text-center p-1">
                      <DeleteIcon />
                  </div>

                  {/* More */}
                  <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                      <MoreVertIcon />
                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default ScrollableTable;
