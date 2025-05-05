
// Define payment statuses
export type PaymentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "AWAITING_RISK_ANALYSIS"
  | "AUTHORIZED"
  | "RECEIVED" 
  | "CANCELLED" 
  | "DECLINED" 
  | "OVERDUE";

// Define payment methods
export type PaymentMethod = "pix" | "creditCard";

// Define order type
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpfCnpj: string;
  productId: string;
  productName: string;
  productPrice: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  asaasPaymentId?: string;
  createdAt: string;
  updatedAt?: string;
  cardData?: any;
  isManualCard?: boolean;
  has_whatsapp_support?: boolean;
  whatsapp_number?: string;
  productType?: 'digital' | 'physical';
}

export interface OrderTransformed {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf_cnpj: string;
  product_id: string;
  product_name: string;
  product_price: number;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  asaas_payment_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  price: number;
  type: string;
  isDigital?: boolean;
  use_global_colors?: boolean;
  button_color?: string;
  heading_color?: string;
  banner_color?: string;
  status?: boolean;
  has_whatsapp_support?: boolean;
  whatsapp_number?: string;
}

// Custom types for checkout customization
export interface CheckoutCustomization {
  // Appearance
  buttonColor: string;
  buttonTextColor?: string;
  headingColor: string;
  bannerColor: string;
  bannerImageUrl: string | null;
  useGlobalColors?: boolean;
  
  // Content
  buttonText: string;
  headerMessage?: string;
  topMessage: string;
  
  // Timer
  showTimer?: boolean;
  timerEndDate?: string;
  timerMessage?: string;
  timerExpiredMessage?: string;
  countdownEndTime: string;
  
  // Product
  isDigitalProduct: boolean;
  showProduct?: boolean;
  productName?: string;
  productDescription?: string;
  productPrice?: number;
  productImageUrl?: string;
  
  // Additional settings
  showBanner?: boolean;
  showTestimonials?: boolean;
  showRandomVisitors?: boolean;
}

// Add missing type definitions
export interface CustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CreditCardData {
  number: string;
  holderName: string;
  expiryDate: string;
  cvv: string;
  brand?: string;
  bin?: string;
  createdAt?: string;
  installments?: number; // Added installments field
}

export interface BillingData {
  customer?: CustomerData;
  value: number;
  description: string;
  orderId: string;
}

export interface PixPaymentData {
  qrCode: string;
  qrCodeImage: string;
  copyPasteKey: string;
  expirationDate: string;
  paymentId: string;
  value: number;
  description: string;
  status: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  comment: string;
  timeAgo?: string;
}
