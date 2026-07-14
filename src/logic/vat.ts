import { calculateTax, type TaxInputs, type TaxResult } from './gst';

export function calculateVat(inputs: TaxInputs): TaxResult {
  return calculateTax(inputs);
}
