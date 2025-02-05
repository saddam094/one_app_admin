import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Header from "./components/header/header.js";
import Dashboard from "./pages/navbar_screens/dashboard/dashboard.js";
import Ecommerce from "./pages/navbar_screens/e_commerce/e_commerce.js";
import Eproducts from "./pages/navbar_screens/e_products/e_products.js";
import Services from "./pages/navbar_screens/services/services.js";
import Doctor from "./pages/navbar_screens/doctor/doctor.js";
import Cab from "./pages/navbar_screens/cab/cab.js";
import Leisure from "./pages/navbar_screens/leisure/leisure.js";
import RealState from "./pages/navbar_screens/real_state/real_state.js";
/// update page
import EcomUpdate from "./pages/updates/ecom_update/ecom_update.js";
import EcomUpdateProduct from "./pages/updates/ecom_product_update/ecom_product_update.js";

/// add Page
import EcomAddMember from "./pages/add/ecom_add_shop/ecom_add_shop.js";
import EcomAddProduct from "./pages/add/ecom_add_product/ecom_add_product.js";


function NavLink({ to, children }) {
  const location = useLocation();

  // Check if the current route is the same as the link's destination
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`px-3 py-1 rounded-md ${isActive ? 'bg-black text-white' : 'text-slate-500 hover:text-black'}`}
      >
        {children}
      </Link>
    </li>
  );
}

function App() {

  const [selectedDuration, setSelectedDuration] = useState(null);

  // Handle filter change
  const handleDurationChange = (e) => {
    setSelectedDuration(Number(e.target.value));
  };

  return (
    <Router >
      <Header />
      <div className="flex h-16 items-center px-10 border-b-2 bg-slate-100 border-slate-300 justify-between">
        {/* navigation bar */}
        <nav>
          <ul className="flex space-x-10 ">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/e-commerce">E-Commerce</NavLink>
            <NavLink to="/e-products">E-Products</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/doctor">Doctor</NavLink>
            <NavLink to="/cab">Cab</NavLink>
            <NavLink to="/leisure">Leisure</NavLink>
            <NavLink to="/real-state">Real State</NavLink>
          </ul>
        </nav>

        {/* Filter ---> Duration wise */}
        <div className="border-slate-500 border-2 rounded-md">
          {/* Duration Filter Dropdown */}
          <select
            onChange={handleDurationChange}
            value={selectedDuration || ""}
            className="px-3 py-1 rounded-md text-slate-700 outline-none border-none"
          >
            {/* <option value="">Select Duration</option> */}
            <option value="1">This Months</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">1 Yaer</option>
            <option value="24">2 Yaers</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/e-commerce" element={<Ecommerce />} />
        <Route path="/e-products" element={<Eproducts />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/cab" element={<Cab />} />
        <Route path="/leisure" element={<Leisure />} />
        <Route path="/real-state" element={<RealState />} />
        <Route path="/ecom_update" element={<EcomUpdate />} />
        <Route path="/ecom_add_member" element={<EcomAddMember />} />
        <Route path="/ecom_product_update" element={<EcomUpdateProduct />} />
        <Route path="/ecom_add_product" element={<EcomAddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;