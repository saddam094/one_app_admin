import { useState,useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import StudentCornerTable from '../../../components/table/StudentCornerTable'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Link } from 'react-router-dom'




const StudentCorner = () => {
  // const notifyError = (message) =>toast.error(message);
  const [search, setSearch] = useState('');
  const [studentCategoryCount, setStudentCategoryCount] = useState([]);
 const[loading, setLoading] = useState(true);
   const[error, setError] = useState(null);

    const fetchData = async () => {
     try {
        const response = await axios.get(
      "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/get_all_subCategories_of_studentCorner"
      );

       console.log("API Response:", response.data);

        if (response.data.statusCode === 200) {
           setStudentCategoryCount(response.data.data);
        } else {
         toast.error(response.data.message || "Something went wrong");
       }
     } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
         toast.error("Failed to fetch data");
     } finally {
      setLoading(false);
   }
  };

 
  useEffect(() => {
    if(studentCategoryCount.length === 0){
      fetchData();
    }
  });
 

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

   return (
    <>
       <div className='px-6 bg-slate-100'>
        <div className=' flex h-14 justify-end items-center'>
          {/* Search */}  
            <div className="flex items-center w-96 h-10 max-w-2xl bg-white shadow-md rounded-full px-4 py-2">   
                <SearchIcon className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search here..."
                  className="bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none w-full"
                />
            </div>
            <div className='w-6'></div>
            {/* manage category */}
            <Link to="/manage_studentCorner_category">
              <button className="h-10 w-50 text-white bg-black text-md rounded-md px-6 py-2 font-medium">
              Manage Categories
            </button> 
            </Link> 
            <div className='w-6'></div>
            {/* Add Member */}
            <Link to="/add_corner">
            <button className="h-10 w-50 text-white bg-black text-md rounded-md px-6 py-2 font-medium">
              Add Student Corner 
            </button>
            </Link>

        </div>
       {/* Category Cards */}
      <div className="grid grid-cols-4 gap-x-16 gap-y-4 mt-2 mb-4">
              {studentCategoryCount.map((category,index) => (
         <div
            key={index}
           className="flex flex-row h-20 bg-pink-200 items-center justify-start p-2 gap-3 rounded-md shadow-md"
          >
           {/* Left Image */}
            <div className="h-16 w-16 bg-white rounded-md border-4 border-black text-white flex items-center justify-center p-2">
           <img
              src={category.imageURL}
              alt={category.subCategory}
              className="w-14 h-12 rounded-sm"
           />
      </div>

      {/* Right Content */}
         <div className="flex flex-col h-16 justify-between">
           <div className="text-lg text-gray-600 font-serif">
          {category.subCategory}
          </div>
           <div className="text-xl text-black font-semibold">
              {category.count}
            </div>
          </div>
         </div>
    ))}
 </div>



         <StudentCornerTable />
      </div>
    </>
  )
}

export default StudentCorner
