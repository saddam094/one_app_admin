import React, { useEffect, useState, useCallback } from "react";
import UserImage from "../../assets/images/person male.png"
// import { toast } from "react-toastify";
import axios from "axios";

const ProfileCard = ({ shopId, ownerEmail }) => {

  const [ownerProfileDetails, setOwnerProfileDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const notify = (message) => toast(message);

  const profileData = useCallback(async () => {
    if (!ownerEmail || !shopId) return;

    setLoading(true); // ✅ Ensure loading state resets on new requests

    const data = { ownerEmail, shopId };

    try {
      const response = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_particular_shop_owner_profile",
        data
      );

      console.log("Response:", response.data);

      if (response.data["body-json"].statusCode === 200) {
        // notify("hello");
        setOwnerProfileDetails(response.data["body-json"]["body"]);
        setError(null); // ✅ Reset error state on success
      } else {
        throw new Error("Failed to fetch owner profile data");
      }
    } catch (error) {
      console.error("Error Getting Profile Data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [shopId, ownerEmail]); // ✅ Memoize with correct dependencies

  useEffect(() => {
    profileData();
  }, [profileData]); // ✅ Fixes ESLint warning


  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="w-2/6 bg-white shadow-lg rounded-lg overflow-hidden mt-8">
      {/* Profile Header */}
      <div className="flex items-center justify-center p-6 bg-gray-400">
        <img
          className="w-24 h-24 rounded-full border-4 border-white"
          src={UserImage} // Replace with profile picture URL
          alt="Profile"
        />
      </div>
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">{ownerProfileDetails.name || "N/A"}</h2>
        <p className="text-sm text-gray-600">{ownerProfileDetails.shopName || "N/A"}</p>
      </div>

      {/* Personal Info */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">📧 Email</span>
          <span className="font-semibold">{ownerProfileDetails.email || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">📍 Location</span>
          <span className="font-semibold">{ownerProfileDetails.address || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">📞 Contact us</span>
          <span className="font-semibold">{ownerProfileDetails.phone || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">🆔 Pan Number</span>
          <span className="font-semibold">DFSGSDFGDS</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">💳 Account Number</span>
          <span className="font-semibold">{ownerProfileDetails.accountNumber || ""}</span>
        </div>
      </div>

      {/* Documents */}
      <div className="px-4 py-4 border-t border-gray-500">
        <h3 className="text-gray-800 text-lg font-semibold mb-4">Documents</h3>
        <div className="flex items-center justify-between text-gray-600 mb-2">
          <span className="text-sm">Aadhar Card</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xs">sadd55asd...</span>
            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              ⬇️
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-2">
          <span className="text-sm">Pan Card</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xs">sadd55asd...</span>
            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              ⬇️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
