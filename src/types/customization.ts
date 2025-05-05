
// Custom types for checkout customization
export interface CheckoutCustomizationSettings {
  // Appearance
  buttonColor: string;
  buttonTextColor?: string;
  headingColor: string;
  bannerColor: string;
  bannerImageUrl: string | null;
  
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
