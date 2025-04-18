import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import ProfileCard from '../../../components/profile_card/profile_card'

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Ecom_product_update = () => {

    const location = useLocation();
    const productId = location.state?.productId || "";
    const category = location.state?.category || "";
    const skuId = location.state?.skuId || "";
    const shopId = location.state?.shopId || "";

    const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const initialProductFormData = {
        adminEmail: '',
        category: category,
        subCategory: '',
        productDetails: {
            productId: productId,
            skuId: skuId,
            productName: '',
            description: '',
            price: '',
            productDiscountPercentage: '',
            image: []
        }
    };

    const [productFormData, setProductFormData] = useState(initialProductFormData);

    const [subCategory, setSubCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    var productImages = [];

    //Fetch API data using Axios  
    const fetchData = async () => {
        try {

            var data = {
                shop_id: shopId
            }

            const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/particular_shop_all_subcategory_admin", data);

            console.log("API Response Sub Category :", response);

            if (response.data && response.data['body-json'].statusCode === 200) {
                setSubCategory(response.data['body-json'].body);
                // setSelectedSubCategory(response.data['body-json'].body[0].title);
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

    const fetchProductDetails = async () => {
        try {

            var data = {
                category: category,
                skuId: skuId
            };

            const response = await axios.post("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/ecom_product_detail_using_skuid", data);

            console.log("API Response Product Details :", response);

            if (response.data && response.data['body-json'].statusCode === 200) {

                const data = response.data['body-json'].body.product;

                initialProductFormData.subCategory = data.subCategory;
                initialProductFormData.productDetails.productName = data.productName;
                initialProductFormData.productDetails.price = data.actualPrice;
                initialProductFormData.productDetails.description = data.description;
                initialProductFormData.productDetails.productDiscountPercentage = data.productDiscountPercentage;
                // initialProductFormData.productDetails.image = data.image;

                productImages = data.image;

                if(selectedSubCategory === ''){
                    setSelectedSubCategory(data.subCategory);
                }

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

        if (initialProductFormData.productDetails.productName === '') {
            fetchProductDetails();
        }

        if (subCategory.length === 0) {
            fetchData();
        }

    });

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
            setProductFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };


    // Handle multiple image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

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
    };

    // Handle Submit
    const handleUpdate = async () => {

        const adminEmail = localStorage.getItem('adminEmail');

        if (productFormData.productDetails.image.length !== 0) {
            await uploadProcess();
        }

        var data = {
            adminEmail: adminEmail,
            category: productFormData.category,
            subCategory: selectedSubCategory,
            productDetails: {
                productId: productFormData.productDetails.productId,
                skuId: productFormData.productDetails.skuId,
                productName: productFormData.productDetails.productName,
                description: productFormData.productDetails.description,
                price: productFormData.productDetails.price,
                productDiscountPercentage: productFormData.productDetails.productDiscountPercentage,
                image: productFormData.productDetails.image.length === 0 ? productImages : productFormData.productDetails.image
            }
        };

        try {
            const response = await axios.post('https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/edit_ecommerce_product', data);

            console.log('Response:', response.data);

            if (response.data['body-json']['statusCode'] === 200) {
                notify("Product Updated Successfully");
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
        };

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
                            'Content-Type': file.type
                        },
                        transformRequest: [(data, headers) => {
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

            productFormData.productDetails.image = imageLinks;

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
        { name: 'productName', placeholder: 'Product Name' },
        { name: 'price', placeholder: 'Price' },
        { name: 'productDiscountPercentage', placeholder: 'Discount %' },
        { name: 'description', placeholder: 'Description', type: 'textarea' }
    ];

    // console.log(productId, skuId, category);

    if (productId === "" || skuId === "") return <p className="text-center">Unable to get product_id</p>;
    if (category === "") return <p className="text-center">Unable to get category</p>;
    if (shopId === "") return <p className="text-center">Unable to get shop_id</p>;

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;


    return (
        <>
            <div className='flex flex-row gap-4 p-4 bg-slate-100'>

                {/* Update Box */}
                <div className='flex flex-col gap-1 w-full'>
                    {/* Header ---> Update Member Details */}
                    <div className='flex gap-2'>
                        <Link to={"/e-products"}>
                            <ArrowBackIcon />
                        </Link>
                        <h1 className="text-lg font-serif">Update Product Details</h1>
                    </div>

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
                                {productFormData.productDetails.image.map((file, index) => {
                                    const isFile = file instanceof File;
                                    const imageUrl = isFile ? URL.createObjectURL(file) : file;

                                    return (
                                        <div key={index} className="relative w-24 h-24">
                                            <img
                                                src={imageUrl}
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
                                    );
                                })}


                                {/* {productFormData.productDetails.image.map((file, index) => (
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
                                ))} */}
                            </div>
                        </form>
                    </div>


                    <div className="flex gap-2 justify-end px-4 py-4">
                        <button className="border border-gray-400 px-6 py-1 rounded-md text-gray-600" onClick={handleClear}>Clear</button>
                        <button className="bg-black text-white px-6 py-1 rounded-md" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Ecom_product_update