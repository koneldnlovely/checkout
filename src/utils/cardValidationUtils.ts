
// Validation for checking if expiry date is valid and not expired
export const isExpiryDateValid = (value: string): boolean => {
  // Format expected: MM/AA
  const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!pattern.test(value)) return false;
  
  const parts = value.split('/');
  const month = parseInt(parts[0], 10);
  const year = parseInt(`20${parts[1]}`, 10);
  
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Js months are 0-indexed
  const currentYear = today.getFullYear();
  
  // Check if card has already expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

// Format expiry date MM/AA
export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  }
};
