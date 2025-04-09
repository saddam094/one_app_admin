import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const P5 = () => {

    // const notify = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const [enquiryList, setEnquiryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Fetch API data using Axios  
    const fetchData = async () => {
        try {
            const response = await axios.get("https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/enquiry_info");

            console.log("API Response:", response);

            if (response.data && response.data['body-json'].statusCode === 200) {
                setEnquiryList(response.data['body-json'].body);
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
        if (enquiryList.length === 0) {
            fetchData();
        }
    });

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-5 py-6">
          {enquiryList.enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-gradient-to-br from-pink-100 to-purple-100 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="mb-2 text-xs text-right text-gray-500">
                <span className="inline-block bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                  {enq.date} at {enq.time}
                </span>
              </div>

              <h2 className="text-xl font-bold capitalize text-purple-700">
                {enq.name}
              </h2>
              <p className="text-sm text-gray-700 mb-2">
                📧{" "}
                <span className="font-medium text-pink-600">{enq.email}</span>
              </p>
              <p className="text-sm text-gray-700 mb-2">
                📞 <span className="font-medium">{enq.number}</span>
              </p>
              <p className="text-sm text-gray-800 mt-2">
                📝 <span className="italic">{enq.requirement}</span>
              </p>
            </div>
          ))}
          </div>
        </>
    )
}

export default P5;