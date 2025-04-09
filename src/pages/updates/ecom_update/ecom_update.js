import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaUpload } from "react-icons/fa";
import { X } from "lucide-react";

const EcomUpdate = () => {

    const location = useLocation();
    const shopId = location.state?.shopId || "";
    const gstNo = location.state?.gstNo || "";

    const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const initialformData = {
        adminEmail: '',
        shopId: shopId,
        shopStatus: true,
        shopDetails: {
            ownerName: '',
            category: '',
            ownerPhone: '',
            ownerEmail: '',
            subCategory: [],
            gstNo: gstNo,
            shopName: '',
            address: ''
        },
        documents: {
            aadhar: '',
            shopBannerimage: ''
        }
    };

    const [formData, setFormData] = useState(initialformData);

    const [subCategories, setSubCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSubCategory = () => {
        if (title && image) {
            setSubCategories([...subCategories, { title, image }]);
            setTitle("");
            setImage(null);
        }
    };

    const removeSubCategory = (index) => {
        const updatedList = subCategories.filter((_, i) => i !== index);
        setSubCategories(updatedList);
    };


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
    const handleUpdate = async () => {

        const adminEmail = localStorage.getItem('adminEmail');
    
        await uploadProcess();

        var data = {
            adminEmail: adminEmail,
            shopStatus: true,
            shopId: shopId,
            shopDetails: {
                ownerName: formData.shopDetails.ownerName,
                Category: formData.shopDetails.category,
                ownerEmail: formData.shopDetails.ownerEmail,
                ownerPhone: formData.shopDetails.ownerPhone,
                shopBannerimage: formData.documents.shopBannerimage,
                subCategory: subCategories,
                gstNo: gstNo,
                shopName: formData.shopDetails.shopName,
                address: formData.shopDetails.address,
                shopStatus: formData.shopDetails.shopStatus
            },
            aadhar: formData.documents.aadhar
        };


        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/edit_ecommerce_shop', data);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Shop Updated Successfully");
                handleClear();
            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
            } else {
                console.log(`api response${response.data['body-json']['statusCode']}`)
            }

        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }

    };



    // API endpoint to get pre-signed URLs


    /**
     * Step 1: Get Pre-Signed URLs by making a POST request.
     */
    const getPresignedUrls = async (sCategoryTitle) => {

        var data = {
            "documents": [
                formData.documents.aadhar.name,
                formData.documents.shopBannerimage.name,
            ],
            "subCategoryImages": sCategoryTitle
        };

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_shop_image_presigned', data);

            if (response.data['body-json'].body?.signedUrls) {
                console.log("✅ Pre-signed URLs fetched successfully!");
                return response.data['body-json'].body;  // Extract URLs
            } else {
                throw new Error("Pre-signed URLs not found in response.");
            }
        } catch (error) {
            console.error("❌ Error fetching pre-signed URLs:", error.message);
            return [];
        }
    };

    /**
     * Step 2: Upload images using the pre-signed URLs (PUT request).
     */


    const uploadImages = async (signedUrls, fileList) => {
        try {
            const files = Object.values(fileList).filter(file => file); // Get only non-null files

            const uploadPromises = files.map(async (file, index) => {
                if (!signedUrls[index]) {
                    console.error(`⚠️ No URL for ${file.name}`);
                    return;
                }

                try {
                    const uploadResponse = await axios.put(signedUrls[index], file, {
                        headers: {
                            'Content-Type': file.type // Ensure correct MIME type (e.g., image/png, application/pdf)
                        },
                        transformRequest: [(data, headers) => {
                            // Axios sometimes modifies data; this ensures raw binary is sent
                            return data;
                        }]
                    });

                    if (uploadResponse.status === 200) {
                        console.log(`✅ Uploaded ${file.name} successfully!`);

                    } else {
                        console.log(`⚠️ Upload failed for ${file.name}, Status: ${uploadResponse.status}`);
                    }
                } catch (error) {
                    console.error(`❌ Error uploading ${file.name}:`, error.message);
                }
            });

            await Promise.all(uploadPromises);
            console.log('✅ All uploads completed!');

        } catch (error) {
            console.error('❌ Error uploading images:', error.message);
        }
    };


    /**
     * Execute the steps in order.
     */
    const uploadProcess = async () => {

        const sCategoryImage = [];
        const sCategoryImageName = [];

        subCategories.forEach((item) => {
            sCategoryImage.push(item.image);
        });

        subCategories.forEach((item) => {
            sCategoryImageName.push(item.image.name);
        });

        const body = await getPresignedUrls(sCategoryImageName);


        if (body.signedUrls.documents.length > 0 && body.signedUrls.subCategoryImages.length > 0) {
            await uploadImages(body.signedUrls.documents, [formData.documents.aadhar, formData.documents.shopBannerimage]);

            formData.documents.aadhar = body.uploadedFiles.documents[0].key;
            formData.documents.shopBannerimage = body.uploadedFiles.documents[1].key;
            console.log('documents completed');

            await uploadImages(body.signedUrls.subCategoryImages, sCategoryImage);

            subCategories.forEach((item, index) => {
                console.log(index);
                subCategories[index].image = body.uploadedFiles.subCategoryImages[index].key;
            });

            console.log('sub category completed');

        } else {
            console.error("❌ No signed URLs received. Aborting upload.");
        }
    };


    // Define dynamic field configurations
    const shopDetailsFields = [
        { name: 'ownerName', placeholder: 'Owner Name' },
        { name: 'ownerPhone', placeholder: 'Phone' },
        { name: 'ownerEmail', placeholder: 'Owner Email' },
        { name: 'shopName', placeholder: 'Shop Name' },
        { name: 'category', placeholder: 'Category' },
        { name: 'address', placeholder: 'Address', type: 'textarea' },
    ];

    const documentFields = [
        { name: 'aadhar', label: 'Aadhar' },
        { name: 'shopBannerimage', label: 'Shop Banner Image' }
    ];

    if (shopId === "") return <p className="text-center">Unable to get shop_id</p>;

    return (
        <>
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
                                    rows="1"
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

                {/* Sub Categories */}
                <h1 className="text-lg font-serif">Sub Categories</h1>
                <div className="w-full bg-white p-4 rounded-lg shadow">
                    <div className="flex gap-x-16 gap-y-2">
                        <input
                            type="text"
                            placeholder="Sub Category Name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-2 w-full rounded-md"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border p-2 w-full rounded-md"
                        />
                        {/* {image && <img src={image} alt="Preview" className="w-20 h-20 mt-2" />} */}
                        <button
                            onClick={handleAddSubCategory}
                            className="bg-blue-500 text-white rounded-md w-full "
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-row flex-wrap gap-x-5 gap-y-2">
                        {subCategories.map((sub, index) => (
                            <div key={index} className="relative border p-2 flex flex-col items-center">
                                {/* Cross Icon for Delete */}
                                <X
                                    className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                    size={16}
                                    onClick={() => removeSubCategory(index)}
                                />
                                <p>{sub.title}</p>
                                <img src={sub.image} alt={sub.title} className="w-20 h-20 mt-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Document Uploads */}
                <h1 className="text-lg font-serif">Upload Documents</h1>
                <div className="w-full bg-white px-6 py-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        Clear
                    </button>
                    <button
                        className="bg-black text-white px-8 py-2 rounded-md"
                        onClick={handleUpdate}>
                        Update
                    </button>
                </div>
            </div >
        </>
    )
}

export default EcomUpdate