import React from "react";
import { Link } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

const ScrollableTableEProduct = () => {
  const data = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    quantity: `${index + 1 * 3} kg`,
    expireDate: '15-01-2026',
    price: '2100 rs',
    discount: `10%`,
    storeName: `shop ${index + 1}`,
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">P Name</th>
            <th className="px-4 py-2 border">{'Quantity (KG/GM)'}</th>
            <th className="px-4 py-2 border">Expire Date</th>
            <th className="px-4 py-2 border">S P</th>
            <th className="px-4 py-2 border">P Discount</th>
            <th className="px-4 py-2 border">Store Name</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.id}</td>
              <td className="px-4 py-2 border">{item.name}</td>
              <td className="px-4 py-2 border">{item.quantity}</td>
              <td className="px-4 py-2 border">{item.expireDate}</td>
              <td className="px-4 py-2 border">{item.price}</td>
              <td className="px-4 py-2 border">{item.discount}</td>
              <td className="px-4 py-2 border">{item.storeName}</td>
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

export default ScrollableTableEProduct;
