export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateStockItem(item: {
  stockNumber: string;
  productName: string;
  quantity: number;
  price: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Stock Number validation
  if (!item.stockNumber || !item.stockNumber.trim()) {
    errors.stockNumber = 'Stock number is required';
  } else if (!/^[a-zA-Z0-9]+$/.test(item.stockNumber.trim())) {
    errors.stockNumber = 'Stock number must contain only alphanumeric characters';
  }

  // Product Name validation
  if (!item.productName || !item.productName.trim()) {
    errors.productName = 'Product name is required';
  }

  // Quantity validation
  if (item.quantity === null || item.quantity === undefined || isNaN(item.quantity)) {
    errors.quantity = 'Quantity is required';
  } else if (item.quantity < 0) {
    errors.quantity = 'Quantity must be 0 or greater';
  } else if (!Number.isInteger(item.quantity)) {
    errors.quantity = 'Quantity must be a whole number';
  }

  // Price validation
  if (item.price === null || item.price === undefined || isNaN(item.price)) {
    errors.price = 'Price is required';
  } else if (item.price < 0) {
    errors.price = 'Price must be 0 or greater';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}