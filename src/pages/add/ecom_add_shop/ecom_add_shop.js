import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaUpload } from "react-icons/fa";
import { X } from "lucide-react";

const Ecom_add_shop = () => {


    const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const initialformData = {
        adminEmail: '',
        shopDetails: {
            ownerName: '',
            ownerEmail: '',
            ownerPhone: '',
            category: '',
            subCategory: [],
            gstNo: '',
            shopName: '',
            address: '',
            shopStatus: true
        },
        documents: {
            aadhar: '',
            shopBannerimage: '',
            shopOwnerImage: ''
        }
    };

    const [formData, setFormData] = useState(initialformData);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryList, setCategoryList] = useState([]);

    // const categoryList = [{title: 'food'}, {title: 'grocery'}, {title: 'pharmacy'}];

    const subCategoryList = [];
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoriesImage, setSubCategoriesImage] = useState([]);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);  // store the actual file instead of base64
        }
    };

    const handleAddSubCategory = () => {
        if (title && image) {
            setSubCategories(prev => [...prev, title]);
            setSubCategoriesImage(prev => [...prev, image]);  // store file directly
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


    /// Fetch Category List
    const fetchCategoryList = async () => {
        try {
            const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecom_all_categories_get");

            console.log("API Response:", response);

            if (response.data && response.data['body-json'].statusCode === 200) {
                setCategoryList(response.data['body-json'].body.categories);
                setSelectedCategory(response.data['body-json'].body.categories[0].categoryName);
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
        if (categoryList.length === 0) {
            fetchCategoryList();
        }
    });


    // Handle Submit
    const handleSubmit = async () => {

        console.log('form data', formData);

        // Shop Details ---> Validation
        if (formData.shopDetails.ownerName === '' || formData.shopDetails.ownerEmail === '' || formData.shopDetails.ownerPhone === '' || formData.shopDetails.gstNo === '' || formData.shopDetails.shopName === '' || formData.shopDetails.address === '') {
            notifyError('Shop Details All Fields Are Required');
            return;
        }

        if(selectedCategory === ''){
            notifyError('Please Select Categories');
            return;
        }

        // Sub-category ---> Validation
        if (subCategories.length === 0) {
            notifyError('Please Add Sub-categories');
            return;
        }

        // Documents ---> Validation
        if (!formData.documents.aadhar || !formData.documents.shopBannerimage) {
            notifyError('Please Attach Adhar and Banner Image');
            return;
        }

        const adminEmail = localStorage.getItem('adminEmail');

        await uploadProcess();

        var data = {
            adminEmail: adminEmail,
            shopStatus: true,
            shopDetails: {
                ownerName: formData.shopDetails.ownerName,
                ownerEmail: formData.shopDetails.ownerEmail,
                ownerPhone: formData.shopDetails.ownerPhone,
                category: selectedCategory,
                shopBannerimage: formData.documents.shopBannerimage,
                subCategory: subCategoryList,
                gstNo: formData.shopDetails.gstNo,
                shopName: formData.shopDetails.shopName,
                address: formData.shopDetails.address,
                shopStatus: formData.shopDetails.shopStatus
            },
            aadhar: formData.documents.aadhar,
            shopOwnerImage: formData.documents.shopOwnerImage
        };

        console.log('final data', data);

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_shops', data);

            console.log('Response:', response.data);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Shop Added Successfully");
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
                formData.documents.shopOwnerImage.name
            ],
            "subCategoryImages": sCategoryTitle
        }

        console.log('saddam check karo ', data);

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_shop_image_presigned', data);

            console.log(response);

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

        const sCategoryImageName = [];

        for (let index = 0; index < subCategories.length; index++) {
            sCategoryImageName[index] = subCategoriesImage[index].name;
        }

        const body = await getPresignedUrls(sCategoryImageName);


        if (body.signedUrls.documents.length > 0 && body.signedUrls.subCategoryImages.length > 0) {
            await uploadImages(body.signedUrls.documents, [formData.documents.aadhar, formData.documents.shopBannerimage]);

            formData.documents.aadhar = body.uploadedFiles.documents[0].key;
            formData.documents.shopBannerimage = body.uploadedFiles.documents[1].key;
            formData.documents.shopOwnerImage = body.uploadedFiles.documents[2].key;
            console.log('documents completed');

            await uploadImages(body.signedUrls.subCategoryImages, subCategoriesImage);

            subCategoriesImage.forEach((item, index) => {
                subCategoriesImage[index] = body.uploadedFiles.subCategoryImages[index].key;
            });

            console.log('sub category completed');

            for (let index = 0; index < subCategoriesImage.length; index++) {
                subCategoryList[index] = {
                    title: subCategories[index],
                    image: subCategoriesImage[index]
                };
            }

        } else {
            console.error("❌ No signed URLs received. Aborting upload.");
        }
    };




    // Define dynamic field configurations
    const shopDetailsFields = [
        { name: 'ownerName', placeholder: 'Owner Name' },
        { name: 'ownerEmail', placeholder: 'Email' },
        { name: 'ownerPhone', placeholder: 'Phone' },
        // { name: 'category', placeholder: 'Category' },
        { name: 'gstNo', placeholder: 'GST Number' },
        { name: 'shopName', placeholder: 'Shop Name' },
        { name: 'address', placeholder: 'Address', type: 'textarea' },
    ];

    const documentFields = [
        { name: 'aadhar', label: 'Aadhar Card' },
        { name: 'shopOwnerImage', label: 'Owner Image' },
        { name: 'shopBannerimage', label: 'Shop Banner Image' }
    ];


    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

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

            {/* Select Category */}
            <h1 className="text-lg font-serif">Select Category</h1>
            <div className="w-full bg-white p-4 rounded-lg shadow">
                <select
                    className="border border-gray-300 rounded p-2 w-full"
                    value={selectedCategory}
                    // onChange={handleChangeSelectCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categoryList.map((category, index) => (
                        <option key={index} value={category.categoryName}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
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
                    {subCategoriesImage.map((sub, index) => (
                        <div key={index} className="relative border p-2 flex flex-col items-center">
                            {/* Cross Icon for Delete */}
                            <X
                                className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                                size={16}
                                onClick={() => removeSubCategory(index)}
                            />
                            <p>{subCategories[index]}</p>
                            {/* <img src={sub} alt={subCategories[index]} className="w-20 h-20 mt-2" /> */}
                            <img
                                src={URL.createObjectURL(sub)}  // sub is a File
                                alt={subCategories[index]}
                                className="w-20 h-20 mt-2"
                            />
                        </div>
                    ))}
                </div>
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
        </div >
    );
};

export default Ecom_add_shop;
