
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaUpload } from "react-icons/fa";

const Add_StudentCorner = () => {
  const notify = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);
  

  

  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    email: "",
    cornerName: "",
    gstNo: "",
    city: "",
    address: "",
  });

  const [images, setImages] = useState({
    aadhaarImage: null,
    ownerImage: null,
    bannerImage: null,
  });

  
  const [previewImages, setPreviewImages] = useState({
    aadhaarImage: null,
    ownerImage: null,
    bannerImage: null,
  });

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [genderType, setGenderType] = useState("");
  const [dietType, setDietType] = useState("");
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    fetchCategories();
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_all_subCategories_of_studentCorner"
      );

      if (res.data?.statusCode === 200) {
        setCategoryList(res.data.data);
      } else {
        notifyError("Category fetch failed");
      }
    } catch {
      notifyError("Unable to fetch categories");
    }
  };

  

  const uploadToPresignedUrl = async (url, file) => {
    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
    });
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [key]: file }));

      
      const previewURL = URL.createObjectURL(file);
      setPreviewImages((prev) => ({ ...prev, [key]: previewURL }));
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setGenderType("");
    setDietType("");
  };

  const handleClear = () => {
    setFormData({
      ownerName: "",
      phone: "",
      email: "",
      cornerName: "",
      gstNo: "",
      city: "",
      address: "",
    });

    setImages({
      aadhaarImage: null,
      ownerImage: null,
      bannerImage: null,
    });

    setPreviewImages({
      aadhaarImage: null,
      ownerImage: null,
      bannerImage: null,
    });

    setSelectedCategory("");
    setGenderType("");
    setDietType("");
  };

  

  const handleSubmit = async () => {
    if (!selectedCategory) return notifyError("Select category");
    if (!formData.cornerName || !formData.phone)
      return notifyError("Required fields missing");

    if (selectedCategory === "hostel" && !genderType)
      return notifyError("Select hostel type");

    if (selectedCategory === "tiffin" && !dietType)
      return notifyError("Select diet type");

    try {
      setLoading(true);

      const payload = {
        businessName: formData.cornerName,
        mainCategory: "Student Corner",
        subCategory: selectedCategory,
        description: "Service for students",
        contactNumber: formData.phone.replace(/\D/g, ""),
        addressLine1: formData.address,
        city: formData.city,
        state: "Jharkhand",
        pincode: "834001",
        rating: 4.9,
        galleryCount: 2,
        gstNo: formData.gstNo || "",
        ownerName: formData.ownerName,
        email: formData.email || "",
      };

      if (selectedCategory === "hostel") payload.genderType = genderType;
      if (selectedCategory === "tiffin") payload.dietType = dietType;

      const res = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/create_vendor_for_student_service",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const uploadUrls = res.data?.uploadUrls;

      if (!uploadUrls) {
        notifyError("Presigned URLs not received");
        return;
      }

      
      if (images.bannerImage && uploadUrls?.header) {
        await uploadToPresignedUrl(uploadUrls.header, images.bannerImage);
      }

      
      const galleryImages = [images.aadhaarImage, images.ownerImage];

      if (uploadUrls?.gallery?.length) {
        for (let i = 0; i < uploadUrls.gallery.length; i++) {
          if (galleryImages[i]) {
            await uploadToPresignedUrl(
              uploadUrls.gallery[i].uploadUrl,
              galleryImages[i]
            );
          }
        }
      }

      notify("Student Corner added successfully");
      handleClear();
    } catch (err) {
      console.log("SERVER ERROR 👉", err.response?.data || err);
      notifyError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="flex flex-col gap-1 w-full p-2">
      <div className="flex gap-2 items-center">
        <Link to="/StudentCorner">
          <ArrowBackIcon />
        </Link>
        <h1 className="text-lg font-serif">Student Corner Details</h1>
      </div>

      <div className="border-2 w-full bg-white p-4 rounded-lg shadow">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-2">
          <input name="ownerName" value={formData.ownerName} onChange={handleChange} className="border rounded-lg shadow py-2 px-1" placeholder="Owner Name" />
          <input name="phone" value={formData.phone} onChange={handleChange} className="border rounded-lg shadow py-2 px-1" placeholder="Phone" />
          <input name="email" value={formData.email} onChange={handleChange} className="border rounded-lg shadow py-2 px-1" placeholder="Email" />
          <input name="cornerName" value={formData.cornerName} onChange={handleChange} className="border rounded-lg shadow py-2 px-1" placeholder="Corner Name" />
          <input name="gstNo" value={formData.gstNo} onChange={handleChange} className="border rounded-lg shadow py-2 px-1" placeholder="GST No" />
          <input name="city" value={formData.city} onChange={handleChange} className="border rounded-lg shadow py-2 px-1" placeholder="City" />
          <textarea name="address" value={formData.address} onChange={handleChange} className="md:col-span-3 border rounded-lg shadow py-1 px-1" placeholder="Address" />
        </form>
      </div>

      <h1 className="text-lg font-serif">Select Category</h1>
      <div className="w-full bg-white p-4 rounded-lg shadow">
        <select className="border rounded p-2 w-full" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">Select</option>
          {categoryList.map((c, i) => (
            <option key={i} value={c.subCategory}>{c.subCategory}</option>
          ))}
        </select>
      </div>

      {selectedCategory === "hostel" && (
        <div className="w-full bg-white p-4 rounded-lg shadow">
          <select className="border rounded p-2 w-full" value={genderType} onChange={(e) => setGenderType(e.target.value)}>
            <option value="">Select Hostel Type</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="co-ed">Co-ed</option>
          </select>
        </div>
      )}

      {selectedCategory === "tiffin" && (
        <div className="w-full bg-white p-4 rounded-lg shadow">
          <select className="border rounded p-2 w-full" value={dietType} onChange={(e) => setDietType(e.target.value)}>
            <option value="">Select Diet Type</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="both">Both</option>
          </select>
        </div>
      )}

      <h1 className="text-lg font-serif">Upload Image</h1>
      <div className="w-full bg-white px-6 py-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "aadhaar", key: "aadhaarImage", label: "Aadhaar Image" },
            { id: "owner", key: "ownerImage", label: "Owner Image" },
            { id: "banner", key: "bannerImage", label: "Banner Image" },
          ].map((i) => (
            <div key={i.key} className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-sm font-medium mb-2">{i.label}</p>
              <input hidden type="file" id={i.id} onChange={(e) => handleImageChange(e, i.key)} />
              <label htmlFor={i.id} className="cursor-pointer flex items-center">
                Attach Here <FaUpload className="ml-2" />
              </label>

              {previewImages[i.key] && (
                <img
                  src={previewImages[i.key]}
                  alt="preview"
                  className="mt-3 h-24 w-24 object-cover rounded-md border"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end px-4 py-2">
        <button onClick={handleClear} className="bg-gray-400 text-white px-6 py-2 rounded-md">
          Clear Form
        </button>
        <button onClick={handleSubmit} disabled={loading} className="bg-black text-white px-8 py-2 rounded-md">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Add_StudentCorner;

