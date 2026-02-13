
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaUpload } from "react-icons/fa";


const Manage_student_corner_category = () => {

    const notify = (msg) => toast.success(msg);
    const notifyError = (msg) => toast.error(msg);

    const [isAddCategory, setIsAddCategory] = useState(true);
    const [isUpdateCategory, setIsUpdateCategory] = useState(false);
    const [isDeleteCategory, setIsDeleteCategory] = useState(false);

    const [addCategory, setAddCategory] = useState("");
    const [addImage, setAddImage] = useState(null);

    const [updateCategoryList, setUpdateCategoryList] = useState([]);
    const [selectedUpdateCategory, setSelectedUpdateCategory] = useState({});
    const [updateCategory, setUpdateCategory] = useState("");
    const [updateOldImageUrl, setUpdateOldImageUrl] = useState("");
    const [updateImage, setUpdateImage] = useState(null);

    const [deleteCategoryList, setDeleteCategoryList] = useState([]);
    const [selectedDeleteCategory, setSelectedDeleteCategory] = useState("");

    // ---------------- SELECT CATEGORY ----------------
    const handleCategory = (title) => {
      
         const matchedItem = updateCategoryList.find(
             (item) => item.subCategory.toLowerCase() === title.toLowerCase()
          );


        if (matchedItem) {
            setSelectedUpdateCategory(matchedItem);
            setUpdateCategory(matchedItem.subCategory);
            setUpdateOldImageUrl(matchedItem.imageUrl);
        }
    };

  
    // ---------------- ADD CATEGORY (NEW FLOW) ----------------
 const addStudentCornerCategory = async () => {
  if (!addCategory) return notifyError("Please enter category name");
  if (!addImage) return notifyError("Please select image");

  try {
    // 1️⃣ Add category + get presigned URL
    const res = await axios.post(
      "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/create_subCategories_for_studentCorner",
      {
        subCategory: addCategory,
        imageExtension: addImage.name.split(".").pop() // jpg / png
      }
    );

    if (res.data.statusCode !== 201) {
      return notifyError("Failed to create category");
    }

    const { presignedUploadUrl } = res.data.data;

    // 2️⃣ Upload image to S3
    await axios.put(presignedUploadUrl, addImage, {
      headers: {
        "Content-Type": addImage.type
      }
    });

    notify("Category added successfully");
    setAddCategory("");
    setAddImage(null);

  } catch (err) {
    notifyError("Failed to add category");
    console.error(err);
  }
};


    // ---------------- FETCH CATEGORY ----------------
    const fetchCategoryList = async () => {
        try{
                const res = await axios.get(
                       "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_all_subCategories_of_studentCorner"
                 );
                if (res.data.statusCode === 200) {
                   
                 setUpdateCategoryList(res.data.data);
                   setIsAddCategory(false);
                  setIsUpdateCategory(true);
                  setIsDeleteCategory(false);
                

                
           }
          else{
            notifyError("Failed to fetch categories");
          }
        }catch(error){
            console.error(error);
            notifyError("Something went wrong");
        }
     


        
    };

   


const updateStudentCornerCategory = async () => {
  if (!selectedUpdateCategory?.subCategory) {
    return notifyError("Select category");
  }

  if (!updateCategory.trim()) {
    return notifyError("Enter category name");
  }

  try {
    const res = await axios.put(
      "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/student_service_admin_edit_subcategory",
      {
        oldSubCategory: selectedUpdateCategory.subCategory,
        newSubCategory: updateCategory.trim(),
        imageExtension: updateImage
          ? updateImage.name.split(".").pop()
          : null
      }
    );

    console.log("UPDATE RESPONSE", res.data);

    if (res.data.statusCode !== 200) {
      return notifyError("Update failed");
    }

    // 🔥🔥🔥 MOST IMPORTANT STEP
    if (updateImage && res.data.data?.presignedUploadUrl) {
      await axios.put(
        res.data.data.presignedUploadUrl,
        updateImage,
        {
          headers: {
            "Content-Type": updateImage.type
          }
        }
      );
      console.log("IMAGE UPLOADED TO S3");
    }

    notify("Category updated successfully");
    fetchCategoryList();

  } catch (error) {
    console.error(error);
    notifyError("Image update failed");
  }
};





  const fetchCategoryListToDelete = async () => {
     try {
        const res = await axios.get(
               "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_all_subCategories_of_studentCorner"
        );

        if (res.data.statusCode === 200) {
           const categoryNames = res.data.data.map(
        (item) => item.subCategory
        );

            setDeleteCategoryList(categoryNames);
           setIsAddCategory(false);
           setIsUpdateCategory(false);
            setIsDeleteCategory(true);
        } else {
        notifyError("Failed to fetch categories");
        }
    } catch (error) {
       console.error(error);
       notifyError("Something went wrong");
    }
   };

  const deleteStudentCornerCategory = async () => {
  if (!selectedDeleteCategory) {
    return notifyError("Select category");
  }

  try {
    const res = await axios.delete(
      "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/student_service_admin_delete_subcategory",
      {
        data: {
          subCategory: selectedDeleteCategory
        }
      }
    );

    console.log("DELETE RESPONSE ", res.data);

    if (res.data?.statusCode === 200) {
      notify(res.data.message || "Category deleted successfully");
      setSelectedDeleteCategory("");
      fetchCategoryListToDelete();
      return;
    }

    notifyError("Delete failed");

    } catch (error) {
    console.error("DELETE ERROR ", error.response?.data || error);
    notifyError(error.response?.data?.message || "Delete failed");
   }
  };



    // ---------------- UI ----------------
    return (
        <div className="flex flex-col gap-4 p-4 w-full mx-auto">

            {/* HEADER  +toggle Buttons*/}
            <div className="flex justify-between items-center flex-wrap gap-2">
                {/* Back + Title */}
                <div className="flex items-center gap-2">
                    <Link to="/StudentCorner">
                        <ArrowBackIcon />
                    </Link>
                    <h2 className="text-xl font-semibold">
                        Manage Student Corner Categories
                    </h2>
                </div>
                {/* Toggle Buttons */}

                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2 rounded-md font-medium ${isAddCategory ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                     onClick={() => {
                        setIsAddCategory(true)
                        setIsUpdateCategory(false)
                        setIsDeleteCategory(false)
                     }}>Add</button>
                    <button
                        className={`px-4 py-2 rounded-md font-medium ${isUpdateCategory ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                     onClick={() => {
                        fetchCategoryList();
                        setIsAddCategory(false)
                        setIsUpdateCategory(true)
                        setIsDeleteCategory(false)
                     }}>Update</button>
                    <button
                        className={`px-4 py-2 rounded-md font-medium ${isDeleteCategory ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                     onClick={() => {
                        fetchCategoryListToDelete();                                                            
                        setIsAddCategory(false)
                        setIsUpdateCategory(false)
                        setIsDeleteCategory(true)
                     }}>Delete</button>
                </div>
            </div>

            {/* ADD */}
            {isAddCategory && (
                <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                  <div>
                      <label className="block text-sm font-medium mb-1">Category Name</label>
                     <input
                        value={addCategory}
                        onChange={(e) => setAddCategory(e.target.value)}
                        placeholder="Enter Category Name"
                        className="border p-2 w-full  border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div>
                        <label className="block text-sm font-medium mb-1">Category Image</label>
                     <div className="flex items-center gap-2">
                        <input
                            type="file"
                            onChange={(e) => setAddImage(e.target.files[0])}
                            className="w-full"
                        />
                        <FaUpload className="text-xl text-blue-600" />
                  </div>

                  

                    {addImage && (
                        <img
                            src={URL.createObjectURL(addImage)}
                            className="h-20 mt-2"
                        />
                    )}
                    </div>


                    <button
                        onClick={addStudentCornerCategory}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Add Category
                    </button>
                </div>
            )}

            {/* UPDATE */}
            {isUpdateCategory && (
                <div className="bg-white p-4 rounded-xl shadow-md px-4 py-4">
                    <h1 className="text-lg font-serif mb-2">Select Category</h1>
                    <div className="w-full bg-white p-4 rounded-lg shadow mb-4">
                    <select
                        size={5}
                        onChange={(e) => handleCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {updateCategoryList.map((c, i) => (
                            <option key={i} value={c.subCategory}>
                                  {c.subCategory}
                            </option>

                        ))}
                    </select>
                    </div>
                    <div >
                        <label className="block text-sm font-medium mb-1">Category Name</label>
                         <input
                        value={updateCategory}
                        onChange={(e) => setUpdateCategory(e.target.value)}
                        className="border p-2 w-full mt-2"
                        placeholder="Eneter Category Name"
                    />
                      
                   
                     </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category Image</label>
                     <div className="flex items-center gap-2">
                         <input
                        type="file"
                        onChange={(e) => setUpdateImage(e.target.files[0])}
                        className="w-full mt-4"
                    />
                        <FaUpload className="text-xl text-blue-600" />

                     </div>
                     </div>
                        

                    <button
                        onClick={updateStudentCornerCategory}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition gap-2 mt-4"
                    >
                        Update
                    </button>
                </div>
            )}

            {/* DELETE */}
            {isDeleteCategory && (
                <div className="bg-white p-4 rounded-xl shadow-md px-4 py-4 ">
                    {/* Select Category */}
                    <h1 className="text-lg font-serif mb-2">Select Category</h1>
                    <div className="w-full bg-white p-4 rounded-lg shadow mb-4">

                        <select
                                 size={5}
                                 value={selectedDeleteCategory}
                                 onChange={(e) => setSelectedDeleteCategory(e.target.value)}
                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           {deleteCategoryList.map((c, i) => (
                         <option key={i} value={c}>
                           {c}
                         </option>
                        ))}
                  </select>

                          {/* <select
                        size={5}
                        onChange={(e) => setSelectedDeleteCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {deleteCategoryList.map((c, i) => (
                            <option key={i} value={c.title}>
                                {c.title}
                            </option>
                        ))}
                    </select> */}
                      
                    </div>

                  

                    <button
                        onClick={deleteStudentCornerCategory}
                        className="w-full bg-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition text-white"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default Manage_student_corner_category;
