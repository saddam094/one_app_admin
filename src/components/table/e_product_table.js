import React, { useEffect, useState } from "react";
import axios from 'axios';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

const ScrollableTableEProduct = () => {

  const [eProductTableData, setEProductTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // Fetch API data using Axios  
  const fetchData = async () => {
    try {

      const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_all_products_get");

      if (response.data && response.data['body-json'].statusCode === 200) {
        setEProductTableData(response.data['body-json'].body.products);
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
    if(eProductTableData.length === 0){
      fetchData();
    }
  });

  const deleteProduct = async (skuId, shopId, productId, category, imageUrls) => {

    var data = {
      "adminEmail": "nishasha2012@gmail.com",
      "skuId": skuId,
      "productId": productId,
      "category": category,
      "imageUrls": imageUrls
    };

    try {

      const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_product_deletion', data);

      if (response.data['body-json'].statusCode === 200) {

        console.log('Product Deleted Successfully');
        setLoading(true);
        fetchData();
        notify("Product Deleted Successfully")
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
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">P Name</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Actual Price</th>
            <th className="px-4 py-2 border">S P</th>
            <th className="px-4 py-2 border">P Discount</th>
            <th className="px-4 py-2 border">Store Name</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {eProductTableData.map((item) => (
            <tr key={item.productId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.productId}</td>
              <td className="px-4 py-2 border">{item.productName || 'N/A'}</td>
              <td className="px-4 py-2 border">{item.category || 'N/A'}</td>
              <td className="px-4 py-2 border">₹ {item.actualPrice || 'N/A'}</td>
              <td className="px-4 py-2 border">₹ {item.priceAfterDiscount || 'N/A'}</td>
              <td className="px-4 py-2 border">{item.productDiscountPercentage}%</td>
              <td className="px-4 py-2 border">{item.shopName || 'N/A'}</td>
              <td className="px-4 py-2 border flex justify-evenly">
                {/* Eye */}
                <Link to={"/ecom_product_update"}
                  state={{
                    category: item.category,
                    productId: item.productId,
                    skuId: item.skuId,
                    shopId: item.shopId
                  }}>
                  <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                    <RemoveRedEyeIcon />
                  </div>
                </Link>

                {/* Delete */}
                <div className="h-8 w-8 bg-red-200 rounded-sm text-red-800 text-sm text-center p-1"
                  onClick={() => deleteProduct(item.skuId, item.shopId, item.productId, item.category, item.image)}>
                  <DeleteIcon />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableTableEProduct;
