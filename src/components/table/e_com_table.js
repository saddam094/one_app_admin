import React, { useEffect, useState } from "react";
import axios from 'axios';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const ScrollableTable = () => {

  const [eComTableData, setEComTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // Fetch API data using Axios  
  const fetchData = async () => {
    try {
      const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_all_shops_get");

      if (response.data && response.data['body-json'].statusCode === 200) {
        setEComTableData(response.data['body-json'].body.info);
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
    if(eComTableData.length === 0){
      fetchData();
    }
  });

  const deleteShop = async (shopId, imageList) => {

    var data = {
      "adminEmail": "nishasha2012@gmail.com",
      "shop_id": shopId,
      "imageUrls": imageList
    };

    try {

      const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_delete_shop', data);

      if (response.data['body-json'].statusCode === 200) {

        console.log('Shop Deleted Successfully');
        setLoading(true);
        fetchData();
        notify("Shop Deleted Successfully")
        console.message('Shop Deleted Successfully');
      } else if (response.data['body-json']['statusCode'] === 400) {
        notifyError(response.data['body-json'].body.message);
      } else {
        console.log(`api response : ${response.data['body-json']['statusCode']}`);
      }

    } catch (error) {
      console.error('Error submitting data : ', error.response ? error.response.data : error.message);
    }

  }

  const changeShopStatus = (status, shopId) => {
    console.log(status);
    if (status) {
      if (window.confirm("Do You Have To Deactivate Shop")) {
        activateShop(false, shopId);
      }
    } else {
      if (window.confirm("Do You Have To Activate Shop")) {
        activateShop(true, shopId);
      }
    }
  };

  const activateShop = async (status, shopId) => {

    var data = {
      "adminEmail": "nishasha2012@gmail.com",
      "shop_id": shopId,
      "shopStatus": status
    };

    try {

      const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_update_particular_shop_status', data);

      if (response.data['body-json'].statusCode === 200) {
        setLoading(true);
        fetchData();
      } else if (response.data['body-json']['statusCode'] === 400) {
        notifyError(response.data['body-json'].body.message);
      } else {
        console.log(`api response : ${response.data['body-json']['statusCode']}`);
      }

    } catch (error) {
      console.error('Error submitting data : ', error.response ? error.response.data : error.message);
    }

  }



  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Shop Id</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Email</th>
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
          {eComTableData.map((item) => (
            <tr key={item.shop_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.shop_id}</td>
              <td className="px-4 py-2 border">{item.ownerName || "N/A"}</td>
              <td className="px-4 py-2 border">{item.ownerPhone || "N/A"}</td>
              <td className="px-4 py-2 border">{item.ownerEmail || "N/A"}</td>
              <td className="px-4 py-2 border">{item.gstNo || "N/A"}</td>
              <td className="px-4 py-2 border">{item.shopName || "N/A"}</td>
              <td className="px-4 py-2 border">10</td>
              <td className="px-4 py-2 border">{item.regDate || "N/A"}</td>
              <td className="px-4 py-2 border">{item.address || "N/A"}</td>
              <td className={`px-4 py-2 border ${item.shopStatus ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>{item.shopStatus ? 'Active' : 'Inactive'}</td>
              <td className="px-4 py-2 border flex justify-evenly">
                {/* Eye */}
                <Link to={"/ecom_update"}
                  state={{
                    shopId: item.shop_id,
                    ownerEmail: item.ownerEmail,
                    gstNo: item.gstNo
                  }}>
                  <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                    <RemoveRedEyeIcon />
                  </div>
                </Link>

                {/* Delete */}
                <div className="h-8 w-8 bg-red-200 rounded-sm text-red-800 text-sm text-center p-1"
                  onClick={() => deleteShop(item.shop_id, [item.shopBannerimage, item.shopOwnerImage, item.aadhar])}>
                  <DeleteIcon />
                </div>

                {/* More */}
                <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1"
                  onClick={() => changeShopStatus(item.shopStatus, item.shop_id)}>
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
