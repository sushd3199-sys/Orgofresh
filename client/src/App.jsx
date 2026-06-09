import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./components/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Loading from "./components/Loading";
import Contact from "./pages/Contact";
import Infodelivery from "./pages/Infodelivery";
import ReturnRefund from "./pages/ReturnRefund";
import PaymentMethods from "./pages/PaymentMethods";
import FAQ from "./pages/FAQ";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSellers from "./pages/admin/AdminSellers";
import CreateAdmin from "./pages/CreateAdmin";
import ForgotPassword from "./pages/seller/ForgotPassword";
import ResetPassword from "./pages/seller/ResetPassword";

const App = () => {
  const location = useLocation();
  const IsSellerPath = location.pathname.includes("seller");
  const IsAdminPath  = location.pathname.includes("admin");
  const isHomePage = location.pathname === "/";
  const { showUserLogin, IsSeller, user, admin  } = useAppContext();
  console.log("ADMIN:", admin);
  console.log("USER:", user);

  return (
    <div className="min-h-screen bg-white text-gray-700">
      
      {/* NAVBAR */}
      {!IsSellerPath && !IsAdminPath && <Navbar />}

      {/* LOGIN POPUP */}
      {showUserLogin && <Login />}
      <Toaster />

      {isHomePage ? (
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      ) : (
        <div
          className={
            !IsSellerPath
              ? "px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32"
              : ""
          }
        >
          <Routes>
            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* PRODUCT ROUTES */}
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/products/:category/:id" element={<ProductDetails />} />

            {/* NORMAL ROUTES */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/loader" element={<Loading />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/delivery-info" element={<Infodelivery />} />
            <Route path="/return-refund" element={<ReturnRefund />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/faqs" element={<FAQ />} />
            
 <Route path="/create-admin" element={<CreateAdmin />} /> 
  {/* // when necessary to add admin then only use otherwise hide it for security purpose  */}

  <Route path="/admin/login" element={<AdminLogin />} />
  
  <Route
  path="/admin/sellers"
  element={
    admin === null ? (
      <div className="p-10">Loading...</div>
    ) : admin ? (
      <AdminSellers />
    ) : (
      <Navigate to="/admin/login" />
    )
  }
/>
<Route path="/seller/forgot-password" element={<ForgotPassword />} />
<Route path="/seller/reset-password/:token" element={<ResetPassword />} />

            {/* SELLER ROUTES */}
            <Route
              path="/seller"
              element={IsSeller ? <SellerLayout /> : <SellerLogin />}
            >
              <Route index element={IsSeller ? <AddProduct /> : null} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
              <Route path="edit-product/:id" element={<AddProduct />} />
             
            </Route>
          </Routes>
        </div>
      )}

      {/* FOOTER */}
      {!IsSellerPath && !IsAdminPath && <Footer />}
    </div>
  );
};

export default App;