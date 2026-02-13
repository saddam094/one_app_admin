
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Link } from "react-router-dom";

const toProperCase = (text = "") =>
  text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toUpper = (text = "") => text.toUpperCase();

const StudentCornerTable = () => {
  const [vendorTableData, setVendorTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notify = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_student_corner_for_admin"
      );

      if (response.data && response.data.statusCode === 200) {
        setVendorTableData(response.data.data);
      } else if (response.data.statusCode === 400) {
        notifyError(response.data.message);
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= DELETE VENDOR ================= */
  const deleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const response = await axios.delete(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/delete_vendor_from_student_service",
        { data: { vendorId } }
      );

      if (response.data.statusCode === 200) {
        // Refetch table after deletion
        fetchData();
        notify("Vendor Deleted Successfully");
      } else if (response.data.statusCode === 400) {
        notifyError(response.data.message);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      notifyError("Something went wrong while deleting");
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const changeVendorStatus = (status, vendorId) => {
    const newStatus = status === "active" ? "inactive" : "active";
    if (window.confirm(`Do you want to ${newStatus} this vendor?`)) {
      activateVendor(newStatus, vendorId);
    }
  };

  const activateVendor = async (status, vendorId) => {
    setLoading(true); // show loading while API call happens
    try {
      const response = await axios.put(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/edit_vendor_details_in_student_service",
        { status, vendorId }
      );

      if (response.data.statusCode === 200) {
        // ✅ Refetch table from DB after successful update
        await fetchData();
        notify("Vendor Status Updated Successfully");
      } else if (response.data.statusCode === 400) {
        notifyError(response.data.message);
      }
    } catch (error) {
      console.error("Status Error:", error);
      notifyError("Something went wrong while updating status.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 py-2 border">ID</th>
            <th className="p-4 py-2 border">Reg Date</th>
            <th className="p-4 py-2 border">Name</th>
            <th className="p-4 py-2 border">Phone</th>
            <th className="p-4 py-2 border">Email</th>
            <th className="p-4 py-2 border">GST No</th>
            <th className="p-4 py-2 border">Category</th>
            <th className="p-4 py-2 border">Corner Name</th>
            <th className="p-4 py-2 border">Address</th>
            <th className="p-4 py-2 border">Status</th>
            <th className="p-4 py-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {vendorTableData.length > 0 ? (
            vendorTableData.map((item) => (
              <tr key={item.vendorId}>
                <td className="p-2 border">{item.vendorId}</td>
                <td className="p-2 border">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">{toProperCase(item.ownerName || "N/A")}</td>
                <td className="p-2 border">{item.contact}</td>
                <td className="p-2 border">{item.email || "N/A"}</td>
                <td className="p-2 border">{toUpper(item.gstNo || "N/A")}</td>
                <td className="p-2 border">{toProperCase(item.subCategory)}</td>
                <td className="p-2 border">{toProperCase(item.businessName)}</td>
                <td className="p-2 border">
                  {toProperCase(`${item.address?.Line1 || ""}, ${item.address?.City || ""}`)}
                </td>
                <td className="p-4 py-2 border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs text-white ${
                      item.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {item.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4 py-2 flex justify-evenly">
                  {/* <Link
                    to={"/student_corner_update"}
                    state={{ vendorId: item.vendorId }}
                  > */}
                  <Link to={`/student_corner_update/${item.vendorId}`}>

                    <div className="h-8 w-8 bg-black rounded-sm text-white text-sm text-center p-1">
                      <EditIcon />
                    </div>
                  </Link>

                  <div
                    className="h-8 w-8 bg-red-200 rounded-sm text-red-800 text-sm text-center p-1 cursor-pointer"
                    onClick={() => deleteVendor(item.vendorId)}
                  >
                    <DeleteIcon />
                  </div>

                  <div
                    className="h-8 w-8 bg-black text-white p-1 rounded-sm cursor-pointer flex items-center justify-center"
                    onClick={() => changeVendorStatus(item.status, item.vendorId)}
                  >
                    {item.status === "active" ? (
                      <CheckCircleIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center p-4 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentCornerTable;