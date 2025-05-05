
import { useState, useEffect } from "react";
import { Order, PaymentStatus } from "@/types/checkout";
import { useOrders } from "./useOrders";

export function useFilteredOrders(initialPaymentMethod: "pix" | "creditCard" = "pix") {
  const {
    orders,
    loading,
    paymentMethod,
    statusFilter,
    dateRange,
    customDateRange,
    ordersSummary,
    setStatusFilter,
    setDateRange,
    setCustomDateRange,
    changePaymentMethod,
    updateOrderStatus,
    deleteOrder,
    deleteAllOrders,
  } = useOrders(initialPaymentMethod);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  
  // Handlers for order actions
  const handleViewCustomer = (order: Order) => {
    setSelectedOrder(order);
    setShowCustomerModal(true);
  };

  const handleViewPayment = (order: Order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleChangeStatus = (status: PaymentStatus) => {
    if (selectedOrder?.id) {
      updateOrderStatus(selectedOrder.id, status);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setSelectedOrder(orders.find(o => o.id === orderId) || null);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOrder?.id) {
      deleteOrder(selectedOrder.id);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirm(true);
  };

  const handleConfirmDeleteAll = () => {
    deleteAllOrders();
    setShowDeleteAllConfirm(false);
  };

  return {
    // Order data and filters
    orders,
    loading,
    paymentMethod,
    statusFilter,
    dateRange,
    customDateRange,
    ordersSummary,
    setStatusFilter,
    setDateRange,
    setCustomDateRange,
    changePaymentMethod,
    
    // Modal state
    selectedOrder,
    showCustomerModal,
    showPaymentModal,
    showStatusModal,
    showDeleteConfirm,
    showDeleteAllConfirm,
    
    // Handler functions
    handleViewCustomer,
    handleViewPayment,
    handleEditStatus,
    handleChangeStatus,
    handleDeleteOrder,
    handleConfirmDelete,
    handleDeleteAll,
    handleConfirmDeleteAll,
    
    // Modal controls
    setShowCustomerModal,
    setShowPaymentModal,
    setShowStatusModal,
    setShowDeleteConfirm,
    setShowDeleteAllConfirm,
  };
}
