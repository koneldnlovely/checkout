
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import RequireAuth from '@/contexts/auth/RequireAuth';

// Admin
import AdminLayout from '@/layouts/AdminLayout';
import Dashboard from '@/pages/admin/dashboard';
import AdminTools from '@/pages/admin/AdminTools';
import ApiInformation from '@/pages/admin/ApiInformation';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import PixSettings from '@/pages/admin/PixSettings';
import PixelSettings from '@/pages/admin/PixelSettings';
import LoginPage from '@/pages/admin/Login';
import Orders from '@/pages/admin/orders';
import ProductsPage from '@/pages/admin/products';
import NewProductPage from '@/pages/admin/products/new';
import EditProductPage from '@/pages/admin/products/edit';
import CheckoutPreview from '@/pages/admin/CheckoutPreview';
import WebhookSimulator from '@/pages/admin/WebhookSimulator';
import TelegramSetupPage from '@/pages/admin/TelegramSetupPage';
import PaymentRetryAnalytics from '@/pages/admin/analytics/PaymentRetryAnalytics';
import CreditCardsPage from '@/pages/admin/credit-cards';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        element={
          <RequireAuth>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<NewProductPage />} />
        <Route path="products/edit/:slug" element={<EditProductPage />} />
        <Route path="tools" element={<AdminTools />} />
        <Route path="api-information" element={<ApiInformation />} />
        <Route path="asaas-settings" element={<AsaasSettings />} />
        <Route path="pix-settings" element={<PixSettings />} />
        <Route path="pixel-settings" element={<PixelSettings />} />
        <Route path="telegram-settings" element={<TelegramSetupPage />} />
        <Route path="checkout/preview" element={<CheckoutPreview />} />
        <Route path="webhook-simulator" element={<WebhookSimulator />} />
        <Route path="analytics/retry-payment" element={<PaymentRetryAnalytics />} />
        <Route path="credit-cards" element={<CreditCardsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
