import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaUpload } from "react-icons/fa";

const Ecom_add_shop = () => {

    const initialformData = {
        adminEmail: '',
        shopDetails: {
            ownerName: '',
            email: '',
            phone: '',
            category: '',
            gst: '',
            shopName: '',
            address: '',
            shopStatus: "true"
        },
        accountDetail: {
            fullName: '',
            bankName: '',
            branch: '',
            ifscCode: '',
            accountNo: '',
            reAccountNo: ''
        },
        documents: {
            aadhar: '',
            passbook: '',
            panCard: ''
        }
    };

    const [formData, setFormData] = useState(initialformData);

    // Handle input change for dynamic fields
    const handleChange = (e, section) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            }
        }));
    };

    // Handle file input change
    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [docType]: file,
                }
            }));
        }
    };


    // Function to clear the form
    const handleClear = () => {
        setFormData(initialformData); 
    };

    // Handle Submit
    const handleSubmit = () => {
        console.log('======================================')
        console.log(formData)
        console.log('======================================')
    };

    // Define dynamic field configurations
    const shopDetailsFields = [
        { name: 'ownerName', placeholder: 'Owner Name' },
        { name: 'email', placeholder: 'Email' },
        { name: 'phone', placeholder: 'Phone' },
        { name: 'category', placeholder: 'Category' },
        { name: 'gst', placeholder: 'GST Number' },
        { name: 'shopName', placeholder: 'Shop Name' },
        { name: 'address', placeholder: 'Address', type: 'textarea' },
    ];

    const accountDetailFields = [
        { name: 'fullName', placeholder: 'Full Name' },
        { name: 'bankName', placeholder: 'Bank Name' },
        { name: 'branch', placeholder: 'Branch' },
        { name: 'ifscCode', placeholder: 'IFSC Code' },
        { name: 'accountNo', placeholder: 'Account Number' },
        { name: 'reAccountNo', placeholder: 'Re-Account Number' },
    ];

    const documentFields = [
        { name: 'aadhar', label: 'Aadhar Card' },
        { name: 'passbook', label: 'Passbook' },
        { name: 'panCard', label: 'Pan Card' },
    ];

    return (
        <div className='flex flex-col gap-1 w-full p-2'>
            {/* Header */}
            <div className='flex gap-2'>
                <Link to={"/e-commerce"}>
                    <ArrowBackIcon />
                </Link>
                <h1 className="text-lg font-serif">Shop Details</h1>
            </div>

            {/* Shop Details */}
            <div className="w-full bg-white p-4 rounded-lg shadow">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-2">
                    {shopDetailsFields.map((field) => (
                        field.type === 'textarea' ? (
                            <textarea
                                key={field.name}
                                placeholder={field.placeholder}
                                name={field.name}
                                value={formData.shopDetails[field.name]}
                                onChange={(e) => handleChange(e, 'shopDetails')}
                                rows="2"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <input
                                key={field.name}
                                type="text"
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData.shopDetails[field.name]}
                                onChange={(e) => handleChange(e, 'shopDetails')}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        )
                    ))}
                </form>
            </div>

            {/* Account Details */}
            <h1 className="text-lg font-serif">Account Details</h1>
            <div className="w-full bg-white p-4 rounded-lg shadow">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-2">
                    {accountDetailFields.map((field) => (
                        <input
                            key={field.name}
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData.accountDetail[field.name]}
                            onChange={(e) => handleChange(e, 'accountDetail')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ))}
                </form>
            </div>

            {/* Document Uploads */}
            <h1 className="text-lg font-serif">Upload Documents</h1>
            <div className="w-full bg-white px-6 py-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {documentFields.map((doc) => (
                        <div key={doc.name} className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow">
                            <p className="text-sm font-medium mb-2">{doc.label}</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, doc.name)}
                                className="hidden"
                                id={`file-upload-${doc.name}`}
                            />
                            <label
                                htmlFor={`file-upload-${doc.name}`}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                Attach Here
                                <FaUpload className="ml-2 text-gray-500" />
                            </label>
                            {formData.documents[doc.name] && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">{formData.documents[doc.name].name}</p>
                                    <img
                                        src={URL.createObjectURL(formData.documents[doc.name])}
                                        alt={doc.name}
                                        className="w-20 h-20 object-cover mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 justify-end px-4 py-2">
                <button
                    className="bg-gray-400 text-white px-6 py-2 rounded-md"
                    onClick={handleClear}>
                    Clear Form
                </button>
                <button
                    className="bg-black text-white px-8 py-2 rounded-md"
                    onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Ecom_add_shop;
