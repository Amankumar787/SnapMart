import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCoupons from "./pages/admin/AdminCoupons";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"              element={<Home />} />
      <Route path="/login"         element={<Login />} />
      <Route path="/register"      element={<Register />} />
      <Route path="/products"      element={<Products />} />
      <Route path="/products/:id"  element={<ProductDetail />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart"        element={<Cart />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/orders"      element={<Orders />} />
        <Route path="/orders/:id"  element={<OrderDetail />} />
        <Route path="/profile"     element={<Profile />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin"          element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders"   element={<AdminOrders />} />
          <Route path="/admin/users"    element={<AdminUsers />} />
          <Route path="/admin/coupons"  element={<AdminCoupons />} />
        </Route>
      </Route>
    </Routes>
  );
}