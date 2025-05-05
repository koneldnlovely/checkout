
import React from 'react';

/**
 * Formats a credit card number by adding spaces every 4 digits
 */
export const formatCardNumber = (value: string): string => {
  // Remove any existing spaces
  const valueWithoutSpaces = value.replace(/\s/g, '');
  
  // Remove any other non-numeric characters
  const cleaned = valueWithoutSpaces.replace(/\D/g, '');
  
  // Format with spaces every 4 digits
  let formatted = '';
  for (let i = 0; i < cleaned.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += ' ';
    }
    formatted += cleaned[i];
  }
  
  return formatted;
};

/**
 * Handles card number input change with proper formatting and cursor positioning
 */
export const handleCardNumberChange = (
  e: React.ChangeEvent<HTMLInputElement>, 
  onChange: (...event: any[]) => void
): void => {
  // Get the current cursor position, defaulting to end position if null
  const cursorPos = e.target.selectionStart ?? e.target.value.length;
  
  // Get the current value
  let { value } = e.target;
  
  // Format the card number
  const formatted = formatCardNumber(value);
  
  // Update the input field with the formatted value
  e.target.value = formatted;
  
  // Update form value with the formatted value WITH spaces
  onChange(formatted);
  
  // Calculate new cursor position after formatting
  // For example, if user typed a digit at position 4, we need to move cursor to position 5 (after the space)
  let newCursorPos = cursorPos;
  const spacesBeforeCursor = Math.floor((cursorPos > 0 ? cursorPos - 1 : 0) / 4);
  newCursorPos = Math.min(cursorPos + spacesBeforeCursor, formatted.length);
  
  // Set the cursor position to where it should be after formatting
  // Only attempt to set selection range if the element is focused
  if (document.activeElement === e.target) {
    setTimeout(() => {
      e.target.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }
};

/**
 * Handles expiry date input formatting (MM/AA)
 */
export const handleExpiryDateChange = (
  e: React.ChangeEvent<HTMLInputElement>, 
  onChange: (...event: any[]) => void,
  formatFn: (value: string) => string
): void => {
  const { value } = e.target;
  const formatted = formatFn(value);
  onChange(formatted);
};
