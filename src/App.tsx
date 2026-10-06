import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { Hero } from './components/home/Hero';
import { WhyUs } from './components/home/WhyUs';
import { HowItWorks } from './components/home/HowItWorks';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { FeaturedFarmers } from './components/home/FeaturedFarmers';
import { AiAssistant } from './components/ai/AiAssistant';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { CartDrawer } from './components/marketplace/CartDrawer';
import { CheckoutModal } from './components/marketplace/CheckoutModal';
import { OrdersView } from './components/orders/OrdersView';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FarmerPublicProfile } from './components/farmer/FarmerPublicProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1">
      {activeView === 'home' && (
        <>
          <Hero />
          <WhyUs />
          <HowItWorks />
          <FeaturedProducts />
          <FeaturedFarmers />
        </>
      )}

      {activeView === 'ai-assistant' && <AiAssistant />}

      {activeView === 'marketplace' && <MarketplaceView />}

      {activeView === 'farmers' && <FeaturedFarmers />}

      {activeView === 'farmer-profile' && <FarmerPublicProfile />}

      {activeView === 'farmer-dashboard' && <FarmerDashboard />}

      {activeView === 'customer-orders' && <OrdersView />}

      {activeView === 'admin-dashboard' && <AdminDashboard />}

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <NotificationDrawer />
      <AuthModal />
      <ToastContainer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAF7] font-sans antialiased text-slate-800">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}
