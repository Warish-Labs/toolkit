import { calculateTax, type TaxResult } from './gst';

export interface SalesTaxInputs {
  price: number;
  taxRate: number;
}

export function calculateSalesTax({ price, taxRate }: SalesTaxInputs): TaxResult {
  return calculateTax({
    amount: price,
    rate: taxRate,
    action: 'add',
  });
}
