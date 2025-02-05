import React from 'react'
import { Link } from 'react-router-dom';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaUpload } from "react-icons/fa";

const ecom_add_product = () => {
  return (
    <div className='flex flex-col gap-1 w-full'>
            {/* Header ---> Update Member Details */}
            <div className='flex gap-2'>
                <Link to={"/e-products"}>
                    <ArrowBackIcon />
                </Link>
                <h1 className="text-lg font-serif">Add Product Details</h1>
            </div>

            <div className="w-full bg-white p-4 rounded-lg shadow">
                {/* Form */}
                <form className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-2">
                    {/* Left Column */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            placeholder="Sanjeev"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            placeholder="Patel"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <input
                            type="text"
                            placeholder="Male"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone No
                        </label>
                        <input
                            type="text"
                            placeholder="+91 7456123654"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pan Number
                        </label>
                        <input
                            type="text"
                            placeholder="SKDFJHASFNAKN"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email Id
                        </label>
                        <input
                            type="email"
                            placeholder="Sanjeevpat@gmail.com"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            type="text"
                            placeholder="Noida"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            State
                        </label>
                        <input
                            type="text"
                            placeholder="Uttar Pradesh"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Joining Date
                        </label>
                        <input
                            type="date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pincode
                        </label>
                        <input
                            type="text"
                            placeholder="786551"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Store Name
                        </label>
                        <input
                            type="text"
                            placeholder="Sanjeev Servicing Center"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <textarea
                            placeholder="About Employee Address"
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                </form>
            </div>


            {/* =========================================================================== */}


            {/* Heading ---> Update Account Details */}
            <h1 className="text-lg font-serif">Upload Documents</h1>

            <div className="w-full bg-white px-6 py-4 rounded-lg shadow">
                {/* Document Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow">
                        <p className="text-sm font-medium mb-2">Aadhar Card</p>
                        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
                            Attach Here
                            <FaUpload className="ml-2 text-gray-500" />
                        </button>
                    </div>
                    {/* Card 2 */}
                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow">
                        <p className="text-sm font-medium mb-2">Aadhar Card</p>
                        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
                            Attach Here
                            <FaUpload className="ml-2 text-gray-500" />
                        </button>
                    </div>
                    {/* Card 3 */}
                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow">
                        <p className="text-sm font-medium mb-2">Bank Pass Book</p>
                        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
                            Attach Here
                            <FaUpload className="ml-2 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================================== */}

            <div className="flex gap-2 justify-end px-4 py-2">
                <button className="bg-black text-white px-8 py-2 rounded-md">Submit</button>
            </div>


        </div>
  )
}

export default ecom_add_product