// // // import axios from "axios";
// // // import { useState } from "react";
// // // import { toast } from "react-toastify";
// // // import { useNavigate } from "react-router-dom";

// // // const AdminLogin = ({ setIsAuthenticated }) => {
// // //   const navigate = useNavigate();
// // //   const notify = (message) => toast(message);

// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     const data = { email, password };

// // //     try {
// // //       const response = await axios.post(
// // //         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/oneapp_admin_login",
// // //         data
// // //       );

// // //       if (response.data["body-json"].statusCode === 200) {
// // //         notify("Login Successfully");

// // //         localStorage.setItem("isAuthenticated", "true"); // Save login state
// // //         setIsAuthenticated(true);

// // //         const token = response.data['body-json'].body.token;

// // //         localStorage.setItem("token", token);
// // //         localStorage.setItem("adminEmail", email);

// // //         navigate("/");
        
// // //       } else {
// // //         notify(response.data["body-json"].body.message);
// // //       }
// // //     } catch (error) {
// // //       console.error("Error:", error.response ? error.response.data : error.message);
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// // //       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
// // //         <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
// // //         <form onSubmit={handleSubmit}>
// // //           <div className="mb-4">
// // //             <label className="block text-gray-700">Email</label>
// // //             <input
// // //               type="email"
// // //               className="w-full px-4 py-2 border rounded-md"
// // //               placeholder="Enter your email"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               required
// // //             />
// // //           </div>
// // //           <div className="mb-4">
// // //             <label className="block text-gray-700">Password</label>
// // //             <input
// // //               type="password"
// // //               className="w-full px-4 py-2 border rounded-md"
// // //               placeholder="Enter your password"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               required
// // //             />
// // //           </div>
// // //           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
// // //             Login
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AdminLogin;



// // import axios from "axios";
// // import { useState } from "react";
// // import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";

// // const AdminLogin = ({ setIsAuthenticated }) => {
// //   const navigate = useNavigate();
// //   const notify = (message) => toast(message);

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const data = { email, password };

// //     try {
// //       const response = await axios.post(
// //         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/oneapp_admin_login",
// //         data
// //       );

// //       if (response.data["body-json"].statusCode === 200) {
// //         notify("Login Successfully");

// //         localStorage.setItem("isAuthenticated", "true");
// //         setIsAuthenticated(true);

// //         const token = response.data["body-json"].body.token;
// //         localStorage.setItem("token", token);
// //         localStorage.setItem("adminEmail", email);

// //         navigate("/");
// //       } else {
// //         notify(response.data["body-json"].body.message);
// //       }
// //     } catch (error) {
// //       console.error("Error:", error.response ? error.response.data : error.message);
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
// //       <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
// //         <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Admin Login</h2>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="block text-gray-700 font-semibold mb-1">Email</label>
// //             <input
// //               type="email"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               placeholder="Enter your email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-gray-700 font-semibold mb-1">Password</label>
// //             <input
// //               type="password"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               placeholder="Enter your password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <button
// //             type="submit"
// //             className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105"
// //           >
// //             Login
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminLogin;


// import axios from "axios";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const AdminLogin = ({ setIsAuthenticated }) => {
//   const navigate = useNavigate();
//   const notify = (message) => toast(message);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = { email, password };

//     try {
//       const response = await axios.post(
//         "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/oneapp_admin_login",
//         data
//       );

//       if (response.data["body-json"].statusCode === 200) {
//         notify("Login Successfully");

//         localStorage.setItem("isAuthenticated", "true");
//         setIsAuthenticated(true);

//         const token = response.data["body-json"].body.token;
//         localStorage.setItem("token", token);
//         localStorage.setItem("adminEmail", email);

//         navigate("/");
//       } else {
//         notify(response.data["body-json"].body.message);
//       }
//     } catch (error) {
//       console.error("Error:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 p-6">
//       <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-lg w-96 transition-all transform hover:scale-105">
//         <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-md mb-6">Admin Login</h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="relative">
//             <label className="block text-white text-sm font-semibold mb-1">Email</label>
//             <input
//               type="email"
//               className="w-full px-4 py-2 bg-transparent border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70 transition-all"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="relative">
//             <label className="block text-white text-sm font-semibold mb-1">Password</label>
//             <input
//               type="password"
//               className="w-full px-4 py-2 bg-transparent border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70 transition-all"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-white/20 text-white py-2 rounded-lg font-semibold hover:bg-white/30 transition-all transform hover:scale-105"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;


import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const notify = (message) => toast(message);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const data = { email, password };

    try {
      const response = await axios.post(
        "https://r2fjv162gj.execute-api.ap-south-1.amazonaws.com/prod/oneapp_admin_login",
        data
      );

      if (response.data["body-json"].statusCode === 200) {
        notify("Login Successfully");

        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);

        const token = response.data["body-json"].body.token;
        localStorage.setItem("token", token);
        localStorage.setItem("adminEmail", email);

        navigate("/");
      } else {
        notify(response.data["body-json"].body.message);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 p-6">
      <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-lg w-96 transition-all transform hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-md mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-white text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-transparent border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70 transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label className="block text-white text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-transparent border border-white/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70 transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-white/20 text-white py-2 rounded-lg font-semibold hover:bg-white/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
