import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import MinecraftPage from './pages/MinecraftPage'
import VPSPage from './pages/VPSPage'
import VPSIntelXeonPage from './pages/VPSIntelXeonPage'
import VPSAMDRyzenPage from './pages/VPSAMDRyzenPage'
import VPSAMDEPYCPage from './pages/VPSAMDEPYCPage'
import ServersBasicPage from './pages/ServersBasicPage'
import ServersPremiumPage from './pages/ServersPremiumPage'
import RDPPage from './pages/RDPPage'
import WebHostingPage from './pages/WebHostingPage'
import BotHostingPage from './pages/BotHostingPage'
import DomainPlansPage from './pages/DomainPlansPage'
import StorageServersPage from './pages/StorageServersPage'
import DedicatedMachinesPage from './pages/DedicatedMachinesPage'
import AboutPage from './pages/AboutPage'
import TeamPage from './pages/TeamPage'
import InfrastructurePage from './pages/InfrastructurePage'
import TermsPage from './pages/TermsPage'
import RefundPage from './pages/RefundPage'
import PaymentMethodsPage from './pages/PaymentMethodsPage'
import ComingSoonPage from './pages/ComingSoonPage'
import DashboardPage from './pages/DashboardPage'
import MyServersPage from './pages/MyServersPage'
import AdminPage from './pages/AdminPage'
import AuthPage from './pages/AuthPage'
import LoginSuccessPage from './pages/LoginSuccessPage'
import NotFound from './pages/NotFound'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <AuthProvider>
      <LoadingScreen visible={loading} />
      <Navbar />
      <Routes>
        {/* Public — Main */}
        <Route path="/" element={<Home />} />
        <Route path="/minecraft" element={<MinecraftPage />} />
        <Route path="/vps" element={<VPSPage />} />

        {/* VPS sub-pages */}
        <Route path="/vps/intel-xeon" element={<VPSIntelXeonPage />} />
        <Route path="/vps/amd-ryzen" element={<VPSAMDRyzenPage />} />
        <Route path="/vps/amd-epyc" element={<VPSAMDEPYCPage />} />

        {/* Servers */}
        <Route path="/servers/basic" element={<ServersBasicPage />} />
        <Route path="/servers/premium" element={<ServersPremiumPage />} />

        {/* Hosting services */}
        <Route path="/rdp-hosting" element={<RDPPage />} />
        <Route path="/webhosting" element={<WebHostingPage />} />
        <Route path="/bothosting" element={<BotHostingPage />} />
        <Route path="/domain-plans" element={<DomainPlansPage />} />
        <Route path="/storage-servers" element={<StorageServersPage />} />
        <Route path="/dedicated-machines" element={<DedicatedMachinesPage />} />

        {/* Other games */}
        <Route path="/other-games/hytale" element={<ComingSoonPage tag="Hytale Hosting" title="Hytale Hosting — Coming Soon" description="We'll be among the first to offer Hytale hosting when the game launches. Join Discord to be notified." />} />

        {/* Company */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/infrastructure" element={<InfrastructurePage />} />

        {/* Legal */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/payment-methods" element={<PaymentMethodsPage />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />

        {/* Authenticated */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-servers"
          element={
            <PrivateRoute>
              <MyServersPage />
            </PrivateRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
