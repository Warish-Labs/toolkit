export interface MarginInputs {
  cost: number;
  price: number;
}

export interface MarginResult {
  profit: number;
  margin: number; // gross margin %
  markup: number; // markup %
}

export function calculateMargin({ cost, price }: MarginInputs): MarginResult {
  if (cost < 0 || price < 0) {
    throw new Error('Cost and price must be positive numbers.');
  }

  const profit = price - cost;
  
  let margin = 0;
  if (price > 0) {
    margin = (profit / price) * 100;
  }

  let markup = 0;
  if (cost > 0) {
    markup = (profit / cost) * 100;
  }

  return {
    profit: Math.round(profit * 100) / 100,
    margin: Math.round(margin * 100) / 100,
    markup: Math.round(markup * 100) / 100,
  };
}
