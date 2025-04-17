import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const ScrollableTableDoctor = () => {

  const [doctorTableData, setDoctorTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const fetchData = async () => {
    try {

      const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_list_get");

      if (response.data && response.data['body-json'].statusCode === 200) {
        setDoctorTableData(response.data['body-json'].body);
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
    if (doctorTableData.length === 0) {
      fetchData();
    }
  });

  const deleteDoctor = async (doctorId) => {

    var data = {
      "doctorId": doctorId
    };

    try {

      const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/delete_doctor", data);

      if (response.data && response.data['body-json'].statusCode === 200) {
        setLoading(true);
        fetchData();
        notify("Doctor Deleted Successfully");
      } else if (response.data['body-json']['statusCode'] === 400) {
        notifyError(response.data['body-json'].body.message);
      } else {
        console.log("api response : ", response.data['body-json'].statusCode);
      }

    } catch (error) {
      console.error('Error Deleting Doctor : ', error.message);
    }
  }


  const changeDoctorStatus = (status, doctorId) => {
    console.log(status);
    if (status) {
      if (window.confirm("Do You Have To Deactivate Doctor")) {
        activateDoctor(false, doctorId);
      }
    } else {
      if (window.confirm("Do You Have To Activate Doctor")) {
        activateDoctor(true, doctorId);
      }
    }
  };

  const activateDoctor = async (status, doctorId) => {

    var data = {
      "adminEmail": "nishasha2012@gmail.com",
      "doctor_id": doctorId,
      "status": status
    };

    try {

      const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/update_particular_doctor_status', data);

      if (response.data['body-json'].statusCode === 200) {
        setLoading(true);
        fetchData();
        notify("Doctor Status Updated Successfully");
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
            <th className="px-4 py-2 border">D Name</th>
            <th className="px-4 py-2 border">D Number</th>
            <th className="px-4 py-2 border">D Email</th>
            <th className="px-4 py-2 border">Specialist</th>
            <th className="px-4 py-2 border">Clinic Name</th>
            <th className="px-4 py-2 border">Fee</th>
            <th className="px-4 py-2 border">Joining Date</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctorTableData.map((item) => (
            <tr key={item.doctor_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.doctor_id}</td>
              <td className="px-4 py-2 border">{item.name}</td>
              <td className="px-4 py-2 border">{item.phone}</td>
              <td className="px-4 py-2 border">{item.email}</td>
              <td className="px-4 py-2 border">{item.specialist}</td>
              <td className="px-4 py-2 border">{item.clinicName}</td>
              <td className="px-4 py-2 border">{item.fee}</td>
              <td className="px-4 py-2 border">{item.joiningDate}</td>
              <td className="px-4 py-2 border">{item.address}</td>
              <td className={`px-4 py-2 border ${item.status ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>{item.status ? 'Active' : 'Inactive'}</td>
              <td className="px-4 py-2 border flex justify-evenly">
                {/* Eye */}
                <Link to={"/doctor_update"}
                  state={{
                    category: item.specialist,
                    doctorId: item.doctor_id,
                    email: item.email
                  }}>
                  <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                    <EditIcon />
                  </div>
                </Link>

                {/* Delete */}
                <div className="h-8 w-8 bg-red-200 rounded-sm text-red-800 text-sm text-center p-1"
                  onClick={() => deleteDoctor(item.doctor_id)}>
                  <DeleteIcon />
                </div>

                {/* More */}
                <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1"
                  onClick={() => changeDoctorStatus(item.status, item.doctor_id)}>
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

export default ScrollableTableDoctor;
