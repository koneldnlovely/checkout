
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import CheckoutPreview from '@/pages/admin/CheckoutPreview';
import PaymentPage from '@/pages/PaymentPage';
import Checkout from '@/pages/Checkout';
import SuccessPage from '@/pages/SuccessPage';
import FailedPage from '@/pages/FailedPage';
import PaymentPendingPage from '@/pages/PaymentPendingPage';
import PaymentAnalysisPage from '@/pages/PaymentAnalysisPage';
import RetryPaymentPage from '@/pages/RetryPaymentPage';
import LandingPage from '@/pages/LandingPage';
import AccessDataPage from '@/pages/AccessDataPage';
import AccessProductPage from '@/pages/AccessProductPage';
import BusinessRegistration from '@/pages/BusinessRegistration';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import ThankYouCardPage from '@/pages/ThankYouCardPage';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/checkout" element={<Checkout />} />
      {/* Dynamic route for product checkout with slug parameter */}
      <Route path="/checkout/:productSlug" element={<Checkout />} />
      <Route path="/checkout/preview" element={<CheckoutPreview />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/failed" element={<FailedPage />} />
      {/* Important: Redirect payment-failed to the failed page */}
      <Route path="/payment-failed" element={<Navigate to="/failed" replace />} />
      <Route path="/pending" element={<PaymentPendingPage />} />
      <Route path="/payment-pending" element={<Navigate to="/pending" replace />} />
      <Route path="/payment-analysis" element={<PaymentAnalysisPage />} />
      <Route path="/retry-payment" element={<RetryPaymentPage />} />
      <Route path="/access" element={<AccessDataPage />} />
      <Route path="/product" element={<AccessProductPage />} />
      <Route path="/register" element={<BusinessRegistration />} />
      <Route path="/login" element={<Login />} />
      
      {/* Page for card thank you */}
      <Route path="/thank-you-card" element={<ThankYouCardPage />} />
      
      {/* Fallback route for pages not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
