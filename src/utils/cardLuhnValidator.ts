
/**
 * Implementação do algoritmo de Luhn (mod 10) para validação de números de cartão de crédito
 * Este algoritmo é usado pelas principais bandeiras de cartão para validar se um número é potencialmente válido
 */

/**
 * Valida um número de cartão de crédito usando o algoritmo de Luhn (mod 10)
 * @param cardNumber Número do cartão (sem espaços ou outros caracteres)
 * @returns true se o número passar na validação Luhn, false caso contrário
 */
export function validateCardLuhn(cardNumber: string): boolean {
  // Remover quaisquer espaços ou caracteres não numéricos
  const sanitizedNumber = cardNumber.replace(/\D/g, '');
  
  // Verificar se o número tem pelo menos 13 dígitos (comprimento mínimo para cartões válidos)
  if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
    return false;
  }
  
  // Implementação do algoritmo de Luhn
  let sum = 0;
  let shouldDouble = false;
  
  // Começar da direita para a esquerda
  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  // Se a soma for divisível por 10, o número é válido de acordo com o algoritmo de Luhn
  return sum % 10 === 0;
}

/**
 * Verifica se o BIN (primeiros 6 dígitos) do cartão corresponde a um emissor conhecido
 * @param cardNumber Número do cartão
 * @returns true se o BIN parece válido, false caso contrário
 */
export function validateCardBIN(cardNumber: string): boolean {
  const sanitizedNumber = cardNumber.replace(/\D/g, '');
  
  // Obter o BIN (primeiros 6 dígitos)
  const bin = sanitizedNumber.substring(0, 6);
  
  // Verificar se o BIN tem 6 dígitos
  if (bin.length !== 6) {
    return false;
  }
  
  // Validações básicas para os principais emissores de cartão
  const firstDigit = parseInt(bin.charAt(0));
  const firstTwoDigits = parseInt(bin.substring(0, 2));
  const firstFourDigits = parseInt(bin.substring(0, 4));
  
  // Regras simplificadas para validação de BIN
  // Visa começa com 4
  if (firstDigit === 4) {
    return true;
  }
  
  // Mastercard começa com 51-55 ou faixas específicas que começam com 2
  if ((firstTwoDigits >= 51 && firstTwoDigits <= 55) || 
      (firstTwoDigits === 22 || firstTwoDigits === 23 || 
       firstTwoDigits === 24 || firstTwoDigits === 25 || 
       firstTwoDigits === 26 || firstTwoDigits === 27)) {
    return true;
  }
  
  // American Express começa com 34 ou 37
  if (firstTwoDigits === 34 || firstTwoDigits === 37) {
    return true;
  }
  
  // Discover começa com 6011, 644-649 ou 65
  if (firstFourDigits === 6011 || 
      (firstTwoDigits === 65) || 
      (firstTwoDigits >= 64 && firstTwoDigits <= 65)) {
    return true;
  }
  
  // Diners Club começa com 36, 38 ou 300-305
  if (firstTwoDigits === 36 || firstTwoDigits === 38 || 
      (firstTwoDigits === 30 && parseInt(bin.charAt(2)) >= 0 && parseInt(bin.charAt(2)) <= 5)) {
    return true;
  }
  
  // JCB começa com 3528-3589
  if (firstFourDigits >= 3528 && firstFourDigits <= 3589) {
    return true;
  }
  
  // Elo (específico para Brasil)
  const eloRanges = [
    '401178', '401179', '431274', '438935', '451416', '457393', '457631', '457632',
    '504175', '627780', '636297', '636368', '651652', '651653', '651654', '651655',
    '651656', '651657', '651658', '651659', '655000', '655001', '655002', '655003',
    '655004', '655005', '655006', '655007', '655008', '655009', '655010', '655011',
    '655012', '655013', '655014', '655015', '655016', '655017', '655018', '655019'
  ];
  
  if (eloRanges.some(range => bin.startsWith(range))) {
    return true;
  }
  
  // Hipercard (específico para Brasil)
  const hipercardRanges = ['606282', '637095', '637568', '637599', '637609', '637612'];
  
  if (hipercardRanges.some(range => bin.startsWith(range))) {
    return true;
  }
  
  // BIN não corresponde a nenhum emissor conhecido
  return false;
}

/**
 * Valida um cartão de crédito usando múltiplos métodos
 * @param cardNumber Número do cartão de crédito
 * @returns Um objeto com o resultado da validação e mensagem
 */
export function validateCreditCard(cardNumber: string): { 
  isValid: boolean; 
  message: string;
} {
  const sanitizedNumber = cardNumber.replace(/\D/g, '');
  
  // Verificar comprimento básico
  if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
    return { 
      isValid: false, 
      message: 'Número de cartão com comprimento inválido' 
    };
  }
  
  // Verificar BIN
  if (!validateCardBIN(sanitizedNumber)) {
    return { 
      isValid: false, 
      message: 'Emissor de cartão desconhecido ou inválido' 
    };
  }
  
  // Verificar algoritmo de Luhn
  if (!validateCardLuhn(sanitizedNumber)) {
    return { 
      isValid: false, 
      message: 'Número de cartão inválido' 
    };
  }
  
  return { 
    isValid: true, 
    message: 'Cartão válido' 
  };
}
