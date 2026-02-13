
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaUpload } from "react-icons/fa";

const StudentCornerUpdate = () => {
  const { vendorId } = useParams();

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
    state: "jharkhand",
    pincode: "834001",
  });

  const [images, setImages] = useState({
    aadhaarImage: null,
    ownerImage: null,
    bannerImage: null,
  });

  const [oldImages, setOldImages] = useState({
    aadhaarImage: "",
    ownerImage: "",
    bannerImage: "",
  });

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [genderType, setGenderType] = useState("");
  const [dietType, setDietType] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!vendorId) {
      notifyError("Vendor ID missing in URL");
      return;
    }
    fetchCategories();
    fetchVendorDetails();
  }, [vendorId]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_all_subCategories_of_studentCorner"
      );
      if (res.data?.statusCode === 200) setCategoryList(res.data.data);
    } catch {
      notifyError("Unable to fetch categories");
    }
  };

  const fetchVendorDetails = async () => {
    try {
      const res = await axios.get(
        `https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/search_on_student_corner?VendorID=${vendorId}`
      );

      const vendor = res.data?.items?.[0];
      if (!vendor) return notifyError("Vendor not found");

      setFormData({
        ownerName: vendor.ownerName || "",
        phone: vendor.Contact || "",
        email: vendor.email || "",
        cornerName: vendor.BusinessName || "",
        gstNo: vendor.gstNo || "",
        city: vendor.City || "",
        address: vendor.Address?.Line1 || "",
        state: vendor.State || "jharkhand",
        pincode: vendor.Pincode || "834001",
      });

      setSelectedCategory(vendor.SubCategory || "");
      setGenderType(vendor.genderType || "");
      setDietType(vendor.dietType || "");

      setOldImages({
        aadhaarImage: vendor.GalleryImageUrls?.[0] || "",
        ownerImage: vendor.GalleryImageUrls?.[1] || "",
        bannerImage: vendor.HeaderImageUrl || "",
      });
    } catch {
      notifyError("Failed to fetch vendor details");
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [key]: file }));
    }
  };

  /* ================= PRESIGNED ================= */
  const getPresignedUrls = async () => {
    try {
      const payload = { vendorId };

      if (images.bannerImage)
        payload.headerImageName = images.bannerImage.name;

      if (images.aadhaarImage || images.ownerImage)
        payload.galleryImageName =
          images.aadhaarImage?.name || images.ownerImage?.name;

      // If no image selected, skip API
      if (!payload.headerImageName && !payload.galleryImageName)
        return null;

      const res = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/add_image_for_vendor_in_student_corner",
        payload
      );

      return res.data.uploadUrls;
    } catch (err) {
      console.error("Presigned error 👉", err.response?.data || err.message);
      notifyError(err.response?.data?.message || "Presigned URL failed");
      return null;
    }
  };

  /* ================= UPLOAD ================= */
  const uploadImages = async (urls) => {
    try {
      if (images.bannerImage && urls?.header?.uploadUrl) {
        await axios.put(urls.header.uploadUrl, images.bannerImage, {
          headers: { "Content-Type": images.bannerImage.type },
        });
      }

      const galleryFile = images.aadhaarImage || images.ownerImage;
      if (galleryFile && urls?.gallery?.uploadUrl) {
        await axios.put(urls.gallery.uploadUrl, galleryFile, {
          headers: { "Content-Type": galleryFile.type },
        });
      }
    } catch {
      notifyError("Image upload failed");
      throw new Error("Upload failed");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Upload images if changed
      const uploadUrls = await getPresignedUrls();
      if (uploadUrls) {
        await uploadImages(uploadUrls);
      }

      const payload = {
        vendorId: vendorId, // ✅ FIXED (important)
        BusinessName: formData.cornerName,
        SubCategory: selectedCategory,
        Contact: formData.phone.replace(/\D/g, ""),
        gstNo: formData.gstNo,
        ownerName: formData.ownerName,
        email: formData.email,
        City: formData.city,
        State: formData.state,
        Pincode: formData.pincode,
        Address: {
          Line1: formData.address,
          City: formData.city,
          State: formData.state,
          Pincode: formData.pincode,
        },
      };

      if (selectedCategory === "hostel")
        payload.genderType = genderType;

      if (selectedCategory === "tiffin")
        payload.dietType = dietType;

      const res = await axios.put(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/edit_vendor_details_in_student_service",
        payload
      );

      if (res.data?.statusCode === 200) {
        notify("Updated Successfully 🎉");
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error("Update error 👉", err.response?.data || err.message);
      notifyError(err.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col gap-2 w-full p-2">
      <div className="flex gap-2 items-center">
        <Link to="/StudentCorner">
          <ArrowBackIcon />
        </Link>
        <h1 className="text-lg font-serif">Update Student Corner</h1>
      </div>

      <div className="border bg-white p-4 rounded shadow grid md:grid-cols-3 gap-3">
        {Object.keys(formData).map((key) =>
          key !== "address" ? (
            <input
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="border rounded p-2"
              placeholder={key}
            />
          ) : (
            <textarea
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="md:col-span-3 border rounded p-2"
              placeholder="Address"
            />
          )
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <select
          className="border p-2 w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categoryList.map((c, i) => (
            <option key={i} value={c.subCategory}>
              {c.subCategory}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow grid md:grid-cols-3 gap-6">
        {[
          { key: "aadhaarImage", label: "Aadhaar" },
          { key: "ownerImage", label: "Owner" },
          { key: "bannerImage", label: "Banner" },
        ].map((item) => (
          <div key={item.key} className="flex flex-col items-center">
            <p>{item.label}</p>

            {oldImages[item.key] && !images[item.key] && (
              <img
                src={oldImages[item.key]}
                className="w-24 h-24 object-cover"
                alt=""
              />
            )}

            {images[item.key] && (
              <img
                src={URL.createObjectURL(images[item.key])}
                className="w-24 h-24 object-cover"
                alt=""
              />
            )}

            <input
              hidden
              type="file"
              id={item.key}
              onChange={(e) => handleImageChange(e, item.key)}
            />
            <label htmlFor={item.key} className="cursor-pointer">
              Change <FaUpload />
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          onClick={handleUpdate}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default StudentCornerUpdate;
