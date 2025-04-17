import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaUpload } from "react-icons/fa";

const Doctor_update = () => {

    const location = useLocation();
    const doctorId = location.state?.doctorId || "";
    const category = location.state?.category || "";
    const email = location.state?.email || "";


    const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const initialformData = {
        adminEmail: '',
        doctorId: doctorId,
        doctorInfo: {
            name: '',
            email: email,
            phone: '',
            clinicName: '',
            fee: '',
            about: '',
            address: '',
        },
        category: category,
        aadhar: '',
        doctorImage: '',
        bannerImage: '',
        status: true,
        timeList: []
    };

    const timeSlot = [
        ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 AM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM"],
        ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 AM", "12:00 AM - 01:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM"],
        ["11:00 AM - 12:00 AM", "12:00 AM - 01:00 PM", "01:00 PM - 02:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM"],
    ];

    const [formData, setFormData] = useState(initialformData);

    const [selectedTime, setSelectedTime] = useState(timeSlot[0]);

    const [selectedCategory, setSelectedCategory] = useState(category);

    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    var doctorAadharImage = '';
    var doctorProfileImage = '';
    var doctorBannerImage = '';

    // Handle Selected Time 
    const handleChangeSelectedTime = (event) => {
        setSelectedTime(timeSlot[event.target.value]);
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
                [docType]: file,
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
            const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_categories_count");

            if (response.data && response.data['body-json'].statusCode === 200) {
                setCategoryList(response.data['body-json'].body);
                setSelectedCategory(response.data['body-json'].body[0].title);
            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
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

    const fetchDoctorDetails = async () => {
        try {

            var data = {
                doctor_id: doctorId
            };

            const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_details_using_doctorId", data);

            console.log("API Response Doctor Details :", response);

            if (response.data && response.data['body-json'].statusCode === 200) {

                const data = response.data['body-json'].body.data;

                initialformData.doctorInfo.name = data.name;
                initialformData.doctorInfo.phone = data.phone;
                initialformData.doctorInfo.clinicName = data.clinicName;
                initialformData.doctorInfo.fee = data.fee;
                initialformData.doctorInfo.about = data.about;
                initialformData.doctorInfo.address = data.address;
                initialformData.status = data.status;
                initialformData.timeList = data.timeList;

                doctorAadharImage = data.aadhar;
                doctorBannerImage = data.bannerImage;
                doctorProfileImage = data.image;

            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
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

        if(initialformData.doctorInfo.name === ''){
            fetchDoctorDetails();
        }

    });

    // Handle Submit
    const handleUpdate = async () => {

        const adminEmail = localStorage.getItem('adminEmail');

        if(formData.aadhar !== '' && formData.bannerImage !== 0 && formData.doctorImage !== ''){
            await uploadProcess();
        }
        
        var data = {
            adminEmail: adminEmail,
            doctorId: doctorId,
            doctorInfo: {
                name: formData.doctorInfo.name,
                email: email,
                phone: formData.doctorInfo.phone,
                clinicName: formData.doctorInfo.clinicName,
                fee: formData.doctorInfo.fee,
                about: formData.doctorInfo.about,
                address: formData.doctorInfo.address,
            },
            category: category,
            aadhar: formData.aadhar === '' ? doctorAadharImage : formData.aadhar,
            doctorImage: formData.doctorImage === '' ? doctorProfileImage : formData.doctorImage,
            bannerImage: formData.bannerImage === '' ? doctorBannerImage : formData.bannerImage,
            status: true,
            timeList: selectedTime
        };

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/edit_doctor_details', data);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Doctor Updated Successfully");
                handleClear();
                console.log('Doctor Updated Successfully');
            } else if (response.data['body-json']['statusCode'] === 400) {
                notify(response.data['body-json'].body.message);
            } else {
                console.log(`API Response: ${response.data['body-json']['statusCode']}`);
            }

        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }
    };


    // API endpoint to get pre-signed URLs


    /**
     * Step 1: Get Pre-Signed URLs by making a POST request.
     */

    const getPresignedUrls = async () => {

        var data = {
            "doctorImage": formData.doctorImage.name,
            "bannerImage": formData.bannerImage.name,
            "aadhar": formData.aadhar.name
        }

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/doctor_image_presigned', data);

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
        const body = await getPresignedUrls();

        if (body.signedUrls.doctorImage.length > 0 && body.signedUrls.bannerImage.length > 0 && body.signedUrls.aadhar.length > 0) {

            await uploadImages(body.signedUrls.doctorImage, [formData.doctorImage]);
            await uploadImages(body.signedUrls.bannerImage, [formData.bannerImage]);
            await uploadImages(body.signedUrls.aadhar, [formData.aadhar]);

            formData.aadhar = body.uploadedFiles.aadhar[0].key;
            formData.doctorImage = body.uploadedFiles.doctorImage[0].key;
            formData.bannerImage = body.uploadedFiles.bannerImage[0].key;

        } else {
            console.error("❌ No signed URLs received. Aborting upload.");
        }
    };




    // Define dynamic field configurations
    const doctorInfoFields = [
        { name: 'name', placeholder: 'name' },
        { name: 'phone', placeholder: 'Phone' },
        { name: 'clinicName', placeholder: 'Clinic Name' },
        { name: 'fee', placeholder: 'Fee' },
        { name: 'about', placeholder: 'Description', type: 'textarea' },
        { name: 'address', placeholder: 'Address', type: 'textarea' },
    ];

    const documentFields = [
        { name: 'aadhar', label: 'Aadhar' },
        { name: 'doctorImage', label: 'Profile Image' },
        { name: 'bannerImage', label: 'Banner Image' }
    ];

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className='flex flex-col gap-1 w-full p-2'>
            {/* Header */}
            <div className='flex gap-2'>
                <Link to={"/doctor"}>
                    <ArrowBackIcon />
                </Link>
                <h1 className="text-lg font-serif">Update Doctor Details</h1>
            </div>

            {/* Shop Details */}
            <div className="w-full bg-white p-4 rounded-lg shadow">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-2">
                    {doctorInfoFields.map((field) => (
                        field.type === 'textarea' ? (
                            <textarea
                                key={field.name}
                                placeholder={field.placeholder}
                                name={field.name}
                                value={formData.doctorInfo[field.name]}
                                onChange={(e) => handleChange(e, 'doctorInfo')}
                                rows="1"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <input
                                key={field.name}
                                type="text"
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData.doctorInfo[field.name]}
                                onChange={(e) => handleChange(e, 'doctorInfo')}
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
                        <option key={index} value={category.title}>
                            {category.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Time Slots */}
            <h1 className="text-lg font-serif">Select Time Slots</h1>
            <div className="w-full bg-white p-4 rounded-lg shadow">
                <select
                    className="border border-gray-300 rounded p-2 w-full"
                    value={timeSlot[selectedTime]}
                    onChange={handleChangeSelectedTime}
                >
                    {timeSlot.map((slot, index) => (
                        <option key={index} value={index}>
                            {slot.join(", ")}
                        </option>
                    ))}
                </select>
            </div>

            {/* Account Details */}
            {/* <h1 className="text-lg font-serif">Account Details</h1>
            <div className="w-full bg-white p-4 rounded-lg shadow">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-2">
                    {smaccountDetailFields.map((field) => (
                        <input
                            key={field.name}
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData.accountInfo[field.name]}
                            onChange={(e) => handleChange(e, 'accountInfo')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ))}
                </form>
            </div> */}

            {/* Document Uploads */}
            <h1 className="text-lg font-serif">Upload Image</h1>
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
                            {formData[doc.name] && ( // Checking formData directly
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">{formData[doc.name].name}</p>
                                    <img
                                        src={URL.createObjectURL(formData[doc.name])}
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
        </div>
    );
};

export default Doctor_update;
