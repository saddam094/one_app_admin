import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaUpload } from "react-icons/fa";
// import { Email } from '@mui/icons-material';

const Manage_doctors_category = () => {

    const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const [isAddCategory, setIsAddCategory] = useState(true);
    const [isUpdateCategory, setIsUpdateCategory] = useState(false);
    const [isDeleteCategory, setIsDeleteCategory] = useState(false);

    const [addCategory, setAddCategory] = useState("");
    const [addImage, setAddImage] = useState(null);

    const [updateCategoryList, setUpdateCategoryList] = useState([]);
    const [selectedUpdateCategory, setSelectedUpdateCategory] = useState({});
    const [updateCategory, setUpdateCategory] = useState("");
    const [updateOldImageUrl, setUpdateOldImageUrl] = useState("");
    const [UpdateImage, setUpdateImage] = useState(null);

    const handleCategory = (searchTitle) => {
        const matchedItem = updateCategoryList.find(
            (item) => item.title.toLowerCase() === searchTitle.toLowerCase()
        );

        if (matchedItem) {
            console.log("Matched item:", matchedItem);
            setUpdateOldImageUrl(matchedItem.imageUrl);
            setSelectedUpdateCategory(matchedItem);
        } else {
            console.log("No Category match found");
        }
    };

    // Handle Submit
    const addDoctorsCategory = async () => {

        if (addCategory === '') {
            notifyError("Plaese Fill Category Name");
            return;
        }

        let imageUrl = '';

        if (addImage instanceof File) {
            try {
                // Await the upload process and get the new image URL
                imageUrl = await uploadProcess();
            } catch (error) {
                notifyError("Failed to upload image. Please try again.");
                return;
            }
        } else {
            notifyError("Plaese select an image");
            return;
        }

        var data = {
            categoryName: addCategory,
            imageURL: imageUrl
        };

        console.log('Add Services Category', data);

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/add_doctor_categories', data);

            console.log('response ', response);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Category Added Successfully");
                setAddCategory("");
                setAddImage(null);
            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
            } else {
                console.log(`API Response: ${response.data['body-json']['statusCode']}`);
                console.log(response.data['body-json']['body']);
            }

        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }
    };


    // API endpoint to get pre-signed URLs


    /**
     * Step 1: Get Pre-Signed URLs by making a POST request.
     */

    const getPresignedUrls = async (image) => {

        var data = {
            "fileName": [
                image.name
            ]
        }

        console.log(data);

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_category_image_presigned', data);

            console.log('response presigned', response.data);

            if (response.data['body-json'].body?.uploadDetails[0].signedUrl) {
                console.log("✅ Pre-signed URLs fetched successfully!");

                console.log(response.data['body-json'].body.uploadDetails[0]);
                return response.data['body-json'].body.uploadDetails[0];
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


    const uploadImage = async (key, signedUrl, file) => {
        try {
            if (!signedUrl) {
                console.error(`⚠️ No signed URL provided.`);
                return;
            }

            if (!file) {
                console.error(`⚠️ No file provided.`);
                return;
            }

            const uploadResponse = await axios.put(signedUrl, file, {
                headers: {
                    'Content-Type': file.type
                },
                transformRequest: [(data) => data] // Ensure raw binary
            });

            if (uploadResponse.status === 200) {
                console.log(`✅ Uploaded ${file.name} successfully!`);
                return key;
            } else {
                console.log(`⚠️ Upload failed for ${file.name}, Status: ${uploadResponse.status}`);
            }
        } catch (error) {
            console.error(`❌ Error uploading ${file.name}:`, error.message);
        }
    };



    /**
     * Execute the steps in order.
     */
    const uploadProcess = async () => {
        const body = await getPresignedUrls(addImage);

        if (body.signedUrl) {
            const key = await uploadImage(body.key, body.signedUrl, addImage);
            return key;
        } else {
            console.error("❌ No signed URLs received. Aborting upload.");
        }
    };

    /// Get All Category
    const fetchCategoryList = async () => {
        try {
            const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_categories_count");

            console.log('category list ', response);

            if (response.data && response.data['body-json'].statusCode === 200) {

                setUpdateCategoryList(response.data['body-json'].body);
                setSelectedUpdateCategory(response.data['body-json'].body[0]);
                setUpdateOldImageUrl(response.data['body-json'].body[0].imageUrl)
                setIsAddCategory(false);
                setIsUpdateCategory(true);
                setIsDeleteCategory(false);

            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
            } else {
                console.error("Unexpected response format:", response.data['body-json']);
                throw new Error("Failed to fetch data");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            // setError(err.message);
        } finally {
            // setLoading(false);
        }
    };

    /// Update Category
    const updateDoctorsCategory = async () => {

        if (updateCategory === '') {
            notifyError("Plaese Fill New Category Name");
            return;
        }

        let newImageUrl = '';

        if (UpdateImage instanceof File) {
            try {
                // Await the upload process and get the new image URL
                newImageUrl = await uploadProcessUpdateCategory();
            } catch (error) {
                notifyError("Failed to upload image. Please try again.");
                return;
            }
        } else {
            notifyError("Plaese select an image");
            return;
        }

        var data = {
            oldCategoryName: selectedUpdateCategory.title,
            newCategoryName: updateCategory,
            newImageUrl: newImageUrl,
            oldImageUrl: updateOldImageUrl
        };

        console.log('Update Services Category', data);

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/update_doctor_categories', data);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Category Updated Successfully");
                setAddCategory("");
                setAddImage(null);
                fetchCategoryList();
            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
            } else {
                console.log(`API Response: ${response.data['body-json']['statusCode']}`);
                console.log(response.data['body-json']['body']);
            }

        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }
    };

    /**
     * Execute the steps in order.
     */
    const uploadProcessUpdateCategory = async () => {
        const body = await getPresignedUrls(UpdateImage);

        if (body.signedUrl) {
            const key = await uploadImage(body.key, body.signedUrl, UpdateImage);
            return key;
        } else {
            console.error("❌ No signed URLs received. Aborting upload.");
        }
    };



    return (
        <div className="flex flex-col gap-4 w-full mx-auto p-4">
            {/* Header + Toggle Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                {/* Back + Title */}
                <div className="flex items-center gap-2">
                    <Link to="/services">
                        <ArrowBackIcon className="cursor-pointer" />
                    </Link>
                    <h1 className="text-lg font-serif">Manage Doctors Category</h1>
                </div>

                {/* Toggle Buttons */}
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-1 rounded-lg font-medium ${isAddCategory ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                        onClick={() => {
                            setIsAddCategory(true);
                            setIsUpdateCategory(false);
                            setIsDeleteCategory(false);
                        }}
                    >
                        Add
                    </button>

                    <button
                        className={`px-4 py-1 rounded-lg font-medium ${isUpdateCategory ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                        onClick={() => {
                            fetchCategoryList();
                            // setIsAddCategory(false);
                            // setIsUpdateCategory(true);
                            // setIsDeleteCategory(false);
                        }}
                    >
                        Update
                    </button>

                    <button
                        className={`px-4 py-1 rounded-lg font-medium ${isDeleteCategory ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                        onClick={() => {
                            setIsAddCategory(false);
                            setIsUpdateCategory(false);
                            setIsDeleteCategory(true);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Add Category Form */}
            {isAddCategory && (
                <div className="bg-white rounded-xl shadow-md px-4 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category Name</label>
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={addCategory}
                            onChange={(e) => setAddCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category Image</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAddImage(e.target.files[0])}
                                className="w-full"
                            />
                            <FaUpload className="text-xl text-blue-600" />
                        </div>

                        {/* Preview */}
                        {addImage && (
                            <img
                                src={URL.createObjectURL(addImage)}
                                alt="Preview"
                                className="mt-3 h-20 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                    <button
                        onClick={addDoctorsCategory}
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Add Category
                    </button>
                </div>
            )}

            {/* Update Category Placeholder */}
            {isUpdateCategory && (
                <div className="bg-white rounded-xl shadow-md px-4 py-4">
                    {/* Select Category */}
                    <h1 className="text-lg font-serif">Select Category</h1>
                    <div className="w-full bg-white p-4 rounded-lg shadow">
                        <select
                            className="border border-gray-300 rounded p-2 w-full"
                            value={selectedUpdateCategory.title}
                            onChange={(e) => handleCategory(e.target.value)}
                        >
                            {updateCategoryList.map((category, index) => (
                                <option key={index} value={category.title}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category Name</label>
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={updateCategory}
                            onChange={(e) => setUpdateCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category Image</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUpdateImage(e.target.files[0])}
                                className="w-full"
                            />
                            <FaUpload className="text-xl text-blue-600" />
                        </div>

                        {/* Preview */}
                        {UpdateImage && (
                            <img
                                src={URL.createObjectURL(UpdateImage)}
                                alt="Preview"
                                className="mt-3 h-20 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                    <button
                        onClick={updateDoctorsCategory}
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Update Category
                    </button>
                </div>
            )}

            {/* Delete Category Placeholder */}
            {isDeleteCategory && (
                <div className="bg-white rounded-xl shadow-md px-4 py-4">
                    <p className="text-gray-600">Delete category UI will go here.</p>
                </div>
            )}
        </div>
    );
};

export default Manage_doctors_category;