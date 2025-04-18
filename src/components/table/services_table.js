import React, { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
// import MoreVertIcon from '@mui/icons-material/MoreVert';

const ScrollableTableServices = () => {

  const [serviceManTableData, setServiceManTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);


  const fetchData = async () => {
    try {

      const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/all_serviceman");

      if (response.data && response.data['body-json'].statusCode === 200) {
        setServiceManTableData(response.data['body-json'].body.data);
      } else if (response.data['body-json']['statusCode'] === 400) {
        notifyError(response.data['body-json'].body.message);
      } else {
        console.error("Unexpected Response Formate : ", response.data['body-json']);
        throw new Error("Failed to fetch data");
      }

    } catch (error) {
      console.log('Fetch Error : ', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(serviceManTableData.length === 0){
      fetchData()
    }
  });

  const deleteServiceMan = async (serviceManId, imageList) => {

    var img = imageList.filter(item => item !== null && item !== "");

    var data = {
      "serviceManId": serviceManId,
      "imageUrls": img.length === 0 ? [] : img
    };

    console.log('Delete Service Man', data);

    try {

      const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/delete_serviceman", data);

      console.log('response Delete', response);

      if (response.data && response.data['body-json'].statusCode === 200) {
        console.log('Service Man Deleted Successfully');
        setLoading(true);
        fetchData();
        notify("Service Man Deleted Successfully");
      } else if (response.data['body-json']['statusCode'] === 400) {
        notifyError(response.data['body-json'].body.message);
      } else {
        console.log("api response : ", response.data['body-json'].statusCode);
      }

    } catch (error) {
      console.error('Error Deleting Service Man : ', error.message);
    }
  }


  /// Update Shop Status
  const changeServiceManStatus = (status, serviceManId) => {
    if (status) {
      if (window.confirm("Do You Have To Deactivate Service Man")) {
        activateServeceMan(false, serviceManId);
      }
    } else {
      if (window.confirm("Do You Have To Activate Service Man")) {
        activateServeceMan(true, serviceManId);
      }
    }
  };

  const activateServeceMan = async (status, serviceManId) => {

    var data = {
      "adminEmail": "nishasha2012@gmail.com",
      "serviceManId": serviceManId,
      "status": status
    };

    try {

      const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/update_particular_serviceman_status', data);

      if (response.data['body-json'].statusCode === 200) {
        setLoading(true);
        fetchData();
        notify("Service Man Status Updated Successfully");
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
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Store Name</th>
            <th className="px-4 py-2 border">Joining Date</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {serviceManTableData.map((item) => (
            <tr key={item.serviceManId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.serviceManId}</td>
              <td className="px-4 py-2 border">{item.name || "N/A"}</td>
              <td className="px-4 py-2 border">{item.phone || "N/A"}</td>
              <td className="px-4 py-2 border">{item.email || "N/A"}</td>
              <td className="px-4 py-2 border">{item.category || "N/A"}</td>
              <td className="px-4 py-2 border">{item.storeName || "N/A"}</td>
              <td className="px-4 py-2 border">{item.joiningDate || "N/A"}</td>
              <td className="px-4 py-2 border">{item.address || "N/A"}</td>
              <td className={`px-4 py-2 border ${item.status ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>{item.status ? 'Active' : 'Inactive'}</td>
              <td className="px-4 py-2 border flex justify-evenly">
                {/* Eye */}
                <Link to={"/service_man_update"}
                  state={{
                    category: item.category,
                    serviceManId: item.serviceManId
                  }}>
                  <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                    <EditIcon />
                  </div>
                </Link>

                {/* Delete */}
                <div className="h-8 w-8 bg-red-200 rounded-sm text-red-800 text-sm text-center p-1"
                  onClick={() => deleteServiceMan(item.serviceManId, [item.aadhar, item.bannerImage, item.servicemanImage])}>
                  <DeleteIcon />
                </div>

                {/* More */}
                <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1"
                  onClick={() => changeServiceManStatus(item.status, item.serviceManId)}>
                  {item.status ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                </div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableTableServices;
