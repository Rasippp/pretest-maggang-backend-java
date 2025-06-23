import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Pages
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import KategoriAdminPage from './pages/admin/KategoriAdminPage';
import ProdukAdminCreatePage from './pages/admin/ProdukAdminCreatePage';
import ProdukAdminDetailPage from './pages/admin/ProdukAdminDetailPage';
import ProdukAdminEditPage from './pages/admin/ProdukAdminEditPage';
import ProdukAdminListPage from './pages/admin/ProdukAdminListPage';
import AdminPesananPage from "./pages/admin/AdminPesananPage";
import AdminPenggunaPage from "./pages/admin/AdminPenggunaPage";

// User Pages
import HomePage from './pages/HomePage';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import DashboardUserPage from './pages/user/DashboardUserPage';
import ProfileUserPage from './pages/user/ProfileUserPage';
import ProdukListPage from './pages/user/ProdukListPage';
import ProdukDetailPage from './pages/user/ProdukDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderHistoryPage from './pages/user/OrderHistoryPage';
import PesananListPage from './pages/user/PesananListPage';
import PesananDetailPage from './pages/user/PesananDetailPage';
import UserPesananPage from "./pages/user/UserPesananPage";
// Components
import Forbidden from './components/Forbidden';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forbidden" element={<Forbidden />} />
                <Route path="/admin/pesanan" element={<AdminPesananPage />} />
        <Route path="/admin/pengguna" element={<AdminPenggunaPage />} />
        <Route path="/user/pesanan" element={<UserPesananPage />} />
        {/* User Routes */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute userRole="user">
            <DashboardUserPage />
          </ProtectedRoute>
        } />
        <Route path="/user/profile" element={
          <ProtectedRoute userRole="user">
            <ProfileUserPage />
          </ProtectedRoute>
        } />
        <Route path="/user/produk" element={
          <ProtectedRoute userRole="user">
            <ProdukListPage />
          </ProtectedRoute>
        } />
        <Route path="/user/produk/:id" element={
          <ProtectedRoute userRole="user">
            <ProdukDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/user/keranjang" element={
          <ProtectedRoute userRole="user">
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/user/checkout" element={
          <ProtectedRoute userRole="user">
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/user/orders" element={
          <ProtectedRoute userRole="user">
            <OrderHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/user/pesanan" element={
          <ProtectedRoute userRole="user">
            <PesananListPage />
          </ProtectedRoute>
        } />
        <Route path="/user/pesanan/:id" element={
          <ProtectedRoute userRole="user">
            <PesananDetailPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute userRole="admin">
            <DashboardAdminPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/kategori" element={
          <ProtectedRoute userRole="admin">
            <KategoriAdminPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/produk" element={
          <ProtectedRoute userRole="admin">
            <ProdukAdminListPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/produk/create" element={
          <ProtectedRoute userRole="admin">
            <ProdukAdminCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/produk/detail/:id" element={
          <ProtectedRoute userRole="admin">
            <ProdukAdminDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/produk/edit/:id" element={
          <ProtectedRoute userRole="admin">
            <ProdukAdminEditPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
