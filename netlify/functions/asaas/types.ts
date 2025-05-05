
export interface AsaasCustomerRequest {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  orderId: string;
  value: number;
  description?: string;
}

export interface AsaasCustomerResponse {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

export interface AsaasPaymentResponse {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  status: string;
  dueDate: string;
  paymentDate?: string;
  description: string;
  billingType: string;
  invoiceUrl: string;
  externalReference: string;
}

export interface AsaasPixQrCodeResponse {
  success: boolean;
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface SupabasePaymentData {
  order_id: string;
  payment_id: string;
  status: string;
  amount: number;
  qr_code: string;
  qr_code_image: string;
  copy_paste_key: string;
  expiration_date: string;
}

export class AsaasApiError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "AsaasApiError";
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}
