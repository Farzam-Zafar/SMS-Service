import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy-loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const SendSMS = lazy(() => import('./pages/dashboard/SendSMS'));
const MessageHistory = lazy(() => import('./pages/dashboard/MessageHistory'));
const BuyCredits = lazy(() => import('./pages/dashboard/BuyCredits'));
const UserProfile = lazy(() => import('./pages/dashboard/UserProfile'));
const ApiDocs = lazy(() => import('./pages/dashboard/ApiDocs'));
const ApiSettings = lazy(() => import('./pages/dashboard/ApiSettings'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const ManagePackages = lazy(() => import('./pages/admin/ManagePackages'));
const TransactionHistory = lazy(() => import('./pages/admin/TransactionHistory'));
const LandingPage = lazy(() => import('./pages/public/LandingPage'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          
          {/* Protected user routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/send-sms" element={<SendSMS />} />
            <Route path="/messages" element={<MessageHistory />} />
            <Route path="/buy-credits" element={<BuyCredits />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/api-settings" element={<ApiSettings />} />
          </Route>
          
          {/* Admin routes */}
          <Route element={<AdminRoute><DashboardLayout isAdmin /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/packages" element={<ManagePackages />} />
            <Route path="/admin/transactions" element={<TransactionHistory />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;