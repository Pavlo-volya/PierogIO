const { TaxAPI } = require('../apis/tax-api');

/**
 * Calculate tax for an order
 *
 * TaxAPI.lookup returns tax rates in basis points (e.g. 800 -> 8.00%).
 * This function converts basis points to a decimal rate by dividing by 10000
 * and computes per-item tax (including add-ons) rounded down to cents.
 *
 * @param {Object} order - The order object with items array
 * @param {Object} delivery - Delivery information (not used here)
 * @returns {number} - Tax amount in cents
 */
function tax(order, delivery) {
  let hasHotItems = false;
  let totalTax = 0;

  const addOnPrices = {
    'sour-cream': 99,
    'fried-onion': 149,
    'bacon-bits': 199
  };

  for (const item of order.items) {
    // compute item total including add-ons (per-pack)
    let itemTotal = item.unitPriceCents * item.qty;
    if (item.addOns && item.addOns.length > 0) {
      for (const addOn of item.addOns) {
        const p = addOnPrices[addOn] || 0;
        itemTotal += p * item.qty;
      }
    }

    const taxRateBp = TaxAPI.lookup(item.kind);
    const taxRate = (typeof taxRateBp === 'number') ? taxRateBp / 10000 : 0;

    if (taxRate > 0) {
      const itemTax = Math.floor(itemTotal * taxRate);
      totalTax += itemTax;
    }

    if (item.kind === 'hot') {
      hasHotItems = true;
    }
  }

  return totalTax;
}

module.exports = { tax };
