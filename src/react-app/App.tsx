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
import AreaMembrosPage from "@/react-app/pages/AreaMembros";
import PaymentSuccessPage from "@/react-app/pages/PaymentSuccess";
import AdminRoute from "@/react-app/auth/AdminRoute";
import FinanceiroPage from "@/react-app/pages/Financeiro";
import PerfilPage from "@/react-app/pages/Perfil";

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
            </Routes>
          </AuthProvider>
        } />
      </Routes>
    </Router>
  );
}
