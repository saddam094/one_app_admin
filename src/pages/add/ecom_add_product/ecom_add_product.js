import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Ecom_add_produt = () => {

    const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const initialProductFormData = {
        adminEmail: '',
        shop_id: '',
        subCategory: '',
        productDetails: {
            productName: '',
            description: '',
            price: '',
            productDiscountPercentage: '',
            image: []
        }
    };

    const [productFormData, setProductFormData] = useState(initialProductFormData);

    const [subCategory, setSubCategory] = useState([]);

    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    //Fetch API data using Axios  
    const fetchData = async (shop_id) => {
        try {

            var data = {
                shop_id: shop_id
            };

            const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/particular_shop_all_subcategory_admin", data);

            if (response.data && response.data['body-json'].statusCode === 200) {
                setSubCategory(response.data['body-json'].body);
                setSelectedSubCategory(response.data['body-json'].body[0].title);
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

    // Handle input change for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (['productName', 'description', 'price', 'productDiscountPercentage'].includes(name)) {
            setProductFormData((prev) => ({
                ...prev,
                productDetails: {
                    ...prev.productDetails,
                    [name]: value
                }
            }));
        } else {
            console.log(name,value);
            setProductFormData((prev) => ({
                ...prev,
                [name]: value
            }));
            if (name === 'shop_id' && value.length > 10) {
                if(value.length < 10 || value === ''){
                    setSubCategory([]);
                    setSelectedSubCategory("");
                }
                fetchData(value);
            }

        }
    };

    // Handle multiple image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to Array
        //const imageURLs = files.map((file) => URL.createObjectURL(file)); // Generate preview URLs

        setProductFormData((prev) => ({
            ...prev,
            productDetails: {
                ...prev.productDetails,
                image: files // Store file objects
            }
        }));
    };

    // Function to remove a selected image
    const removeImage = (index) => {
        setProductFormData((prev) => {
            const updatedImages = [...prev.productDetails.image];
            updatedImages.splice(index, 1);
            return {
                ...prev,
                productDetails: {
                    ...prev.productDetails,
                    image: updatedImages
                }
            };
        });
    };

    // Function to clear the form
    const handleClear = () => {
        setProductFormData(initialProductFormData);
        setSelectedSubCategory("");
    };


    // Handle Submit
    const handleSubmit = async () => {

        // Shop Details ---> Validation
        if (productFormData.shop_id === '' || selectedSubCategory === '' || productFormData.productDetails.productName === '' || productFormData.productDetails.price === '' || productFormData.productDetails.productDiscountPercentage === '' || productFormData.productDetails.description === '') {
            notifyError('Products Details All Fields Are Required');
            return;
        }

        // Sub-category ---> Validation
        if (productFormData.productDetails.image.length === 0) {
            notifyError('Please Add Product Images');
            return;
        }

        const adminEmail = localStorage.getItem('adminEmail');

        await uploadProcess();

        var data = {
            adminEmail: adminEmail,
            shop_id: productFormData.shop_id,
            subCategory: selectedSubCategory,
            productDetails: {
                productName: productFormData.productDetails.productName,
                description: productFormData.productDetails.description,
                price: productFormData.productDetails.price,
                productDiscountPercentage: productFormData.productDetails.productDiscountPercentage,
                image: productFormData.productDetails.image
            }
        };

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_products_add', data);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Product Added Successfully");
                handleClear();
                console.log('Product Added Successfully')
            } else if (response.data['body-json']['statusCode'] === 400) {
                notifyError(response.data['body-json'].body.message);
            } else {
                console.log(`api response${response.data['body-json']['statusCode']}`)
            }

        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }

    };


    /**
     * Step 1: Get Pre-Signed URLs by making a POST request.
     */
    const getPresignedUrls = async () => {

        var data = {
            "type": "product",
            "count": productFormData.productDetails.image.length
        }

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecommerce_product_presigned', data);

            if (response.data['body-json'].body?.presignedUrls) {
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


    const uploadImages = async (signedUrls, imageLinks) => {
        try {
            const files = Object.values(productFormData.productDetails.image).filter(file => file); // Get only non-null files

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

            productFormData.productDetails.image = imageLinks

            // formData.documents.aadhar = signedUrls[0].split('?')[0];
            // formData.documents.passbook = signedUrls[1].split('?')[0];
            // formData.documents.panCard = signedUrls[2].split('?')[0];

            console.log(productFormData);

        } catch (error) {
            console.error('❌ Error uploading images:', error.message);
        }
    };


    /**
     * Execute the steps in order.
     */
    const uploadProcess = async () => {
        const presigned = await getPresignedUrls();

        if (presigned.presignedUrls.length > 0) {
            await uploadImages(presigned.presignedUrls, presigned.imageLinks);
        } else {
            console.error("❌ No signed URLs received. Aborting upload.");
        }
    };

    const productDetailFields = [
        { name: 'shop_id', placeholder: 'Shop Id' },
        { name: 'productName', placeholder: 'Product Name' },
        { name: 'price', placeholder: 'Price' },
        { name: 'productDiscountPercentage', placeholder: 'Discount %' },
        { name: 'description', placeholder: 'Description', type: 'textarea' }
    ];

  
    return (
        <div className="flex flex-col gap-1 w-full">
            {/* Header ---> Add Product */}
            <div className="flex gap-2">
                <Link to={"/e-products"}>
                    <ArrowBackIcon />
                </Link>
                <h1 className="text-lg font-serif">Add Product Details</h1>
            </div>

            {/* Product Details */}
            <div className="w-full bg-white p-4 rounded-lg shadow">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-2">
                    {productDetailFields.map((field) => (
                        field.type === 'textarea' ? (
                            <textarea
                                key={field.name}
                                placeholder={field.placeholder}
                                name={field.name}
                                value={field.name in productFormData ? productFormData[field.name] : productFormData.productDetails[field.name] || ''}
                                onChange={handleChange}
                                rows="1"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <input
                                key={field.name}
                                type="text"
                                name={field.name}
                                placeholder={field.placeholder}
                                value={field.name in productFormData ? productFormData[field.name] : productFormData.productDetails[field.name] || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        )
                    ))}

                    <div className='h-5'></div>

                    {/* Select Category */}
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-gray-700 font-medium mb-2">Select Sub-Category</label>
                        <select
                            className="border border-gray-300 rounded p-2 w-full"
                            value={selectedSubCategory}
                            // onChange={handleChangeSelectCategory}
                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                        >
                            {subCategory.map((category, index) => (
                                <option key={index} value={category.title}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Image Upload Field */}
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-gray-700 font-medium">Product Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Image Previews */}
                    <div className="col-span-1 md:col-span-3 flex gap-2 flex-wrap">
                        {productFormData.productDetails.image.map((file, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-md border"
                                />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
                                    onClick={() => removeImage(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </form>
            </div>

            <div className='h-5'></div>

            {/* Buttons */}
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

export default Ecom_add_produt;