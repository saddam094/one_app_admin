import React from "react";
import UserImage from "../../assets/images/person male.png"

const ProfileCard = () => {
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
        <h2 className="text-xl font-bold text-gray-800">Sanjeev Patil</h2>
        <p className="text-sm text-gray-600">Janki Kirana Store</p>
      </div>

      {/* Personal Info */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">📧 Email</span>
          <span className="font-semibold">Sanjeevpat@gmail.com</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">📍 Location</span>
          <span className="font-semibold">Noida, UP</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">📞 Contact us</span>
          <span className="font-semibold">+91 7487342323</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 mb-3">
          <span className="text-sm">🆔 Pan Number</span>
          <span className="font-semibold">DFSGSDFGDS</span>
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
