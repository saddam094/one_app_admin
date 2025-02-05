import React from 'react'
import { Link } from 'react-router-dom';
import ProfileCard from '../../../components/profile_card/profile_card'

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaUpload } from "react-icons/fa";

const ecom_update = () => {
    return (
        <>
            <div className='flex flex-row gap-4 p-4 bg-slate-100'>

                {/* =============================================================== */}


                {/* Update Box */}
                <div className='flex flex-col gap-1 w-3/4'>
                    {/* Header ---> Update Member Details */}
                    <div className='flex gap-2'>
                        <Link to={"/e-commerce"}>
                            <ArrowBackIcon />
                        </Link>
                        <h1 className="text-lg font-serif">Update Member Details</h1>
                    </div>

                    <div className="w-full max-w-5xl bg-white p-4 rounded-lg shadow">
                        {/* Form */}
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
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
                                    Category
                                </label>
                                <input
                                    type="text"
                                    placeholder="Mechanic"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Sub Category
                                </label>
                                <input
                                    type="text"
                                    placeholder="Two Wheeler"
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
                            <div className="md:col-span-2">
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

                    {/* =============================================================================== */}

                    {/* Heading ---> Update Account Details */}
                    <h1 className="text-lg font-serif">Update Account Details</h1>

                    <div className="w-full px-4 py-3 bg-white shadow-md rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Bank Name</label>
                                <input type="text" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Branch Name</label>
                                <input type="text" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Name</label>
                                <input type="text" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                            <div>
                                <label className="block text-gray-700">IFSC CODE</label>
                                <input type="text" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Account Number</label>
                                <input type="text" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Re-Enter Account Number</label>
                                <input type="text" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Bank Address</label>
                            <textarea className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" rows="3"></textarea>
                        </div>
                    </div>

                    {/* ========================================================== */}

                    <div className="flex gap-2 justify-end px-4 py-2">
                        <button className="bg-black text-white px-4 py-2 rounded-md">Update</button>
                        <button className="border border-gray-400 px-4 py-2 rounded-md text-gray-600">Cancel</button>
                    </div>


                </div>

                {/* Profile Box */}
                <ProfileCard />

            </div>
        </>
    )
}

export default ecom_update