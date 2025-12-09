import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/react-app/auth/AuthProvider";
import HomePage from "@/react-app/pages/Home";
import LoginPage from "@/react-app/pages/Login";
import CadastroPage from "@/react-app/pages/Cadastro";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import DashboardPage from "@/react-app/pages/Dashboard";
import AdminLoginPage from "@/react-app/pages/AdminLogin";
import AdminDashboardPage from "@/react-app/pages/AdminDashboardBasic";
import AdminWithdrawalsPage from "@/react-app/pages/AdminWithdrawals";
import AdminSettingsPage from "@/react-app/pages/AdminSettings";
import AdminAffiliatesPage from "@/react-app/pages/AdminAffiliates";
import AdminBlogListPage from "@/react-app/pages/admin/blog/AdminBlogList";
import AdminBlogNewPage from "@/react-app/pages/admin/blog/AdminBlogNew";
import AdminBlogEditPage from "@/react-app/pages/admin/blog/AdminBlogEdit";
import AdminCommunityPage from "@/react-app/pages/AdminCommunity";
import AdminCouponsPage from "@/react-app/pages/AdminCoupons";
import AreaMembrosPage from "@/react-app/pages/AreaMembros";
import PaymentSuccessPage from "@/react-app/pages/PaymentSuccess";
import AdminRoute from "@/react-app/auth/AdminRoute";
import FinanceiroPage from "@/react-app/pages/Financeiro";
import PerfilPage from "@/react-app/pages/Perfil";
import BlogListPage from "@/react-app/pages/blog/BlogList";
import BlogPostPage from "@/react-app/pages/blog/BlogPost";
import MemberCommunityPage from "@/react-app/pages/MemberCommunity";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } />
        <Route path="/admin/saques" element={
          <AdminRoute>
            <AdminWithdrawalsPage />
          </AdminRoute>
        } />
        <Route path="/admin/configuracoes" element={
          <AdminRoute>
            <AdminSettingsPage />
          </AdminRoute>
        } />
        <Route path="/admin/afiliados" element={
          <AdminRoute>
            <AdminAffiliatesPage />
          </AdminRoute>
        } />
        <Route path="/admin/comunidade" element={
          <AdminRoute>
            <AdminCommunityPage />
          </AdminRoute>
        } />
        <Route path="/admin/cupons" element={
          <AdminRoute>
            <AdminCouponsPage />
          </AdminRoute>
        } />
        <Route path="/admin/blog" element={
          <AdminRoute>
            <AdminBlogListPage />
          </AdminRoute>
        } />
        <Route path="/admin/blog/novo" element={
          <AdminRoute>
            <AdminBlogNewPage />
          </AdminRoute>
        } />
        <Route path="/admin/blog/:id/editar" element={
          <AdminRoute>
            <AdminBlogEditPage />
          </AdminRoute>
        } />
        
        {/* Member routes - wrapped in AuthProvider */}
        <Route path="/*" element={
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/area-membros" element={<AreaMembrosPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/financeiro" element={<FinanceiroPage />} />
              <Route path="/dashboard/perfil" element={<PerfilPage />} />
              <Route path="/dashboard/comunidade" element={<MemberCommunityPage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Routes>
          </AuthProvider>
        } />
      </Routes>
    </Router>
  );
}
