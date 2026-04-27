import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './routes/ProtectedRoute';

import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import MyProfile from './pages/MyProfile';
import UserProfile from './pages/UserProfile';
import Matches from './pages/Matches';
import Swaps from './pages/Swaps';
import Chat from './pages/Chat';
import Sessions from './pages/Sessions';
import Notifications from './pages/Notifications';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile/setup" element={<ProfileSetup />} />
                <Route path="/profile/me" element={<MyProfile />} />
                <Route path="/profile/:id" element={<UserProfile />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/swaps" element={<Swaps />} />
                <Route path="/chat/:swapId" element={<Chat />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
