
export type WebhookEventType = 
  | 'PAYMENT_RECEIVED' 
  | 'PAYMENT_CONFIRMED' 
  | 'PAYMENT_OVERDUE' 
  | 'PAYMENT_CANCELED' 
  | 'PAYMENT_REFUSED';

export interface WebhookEventOption {
  value: WebhookEventType;
  label: string;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface OrderData {
  id: string;
  customer_name: string;
  product_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  asaas_payment_id?: string;
  [key: string]: any;
}
