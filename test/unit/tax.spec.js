const { tax } = require('../../src/tax');

describe('tax', () => {
  it('does not charge tax when all items are frozen', () => {
    const order = {
      items: [
        {
          sku: 'P12-POTATO',
          title: '12-pack Potato',
          kind: 'frozen',
          filling: 'potato',
          qty: 1,
          unitPriceCents: 1299,
          addOns: []
        }
      ]
    };

    const delivery = { zone: 'local', rush: false };

    const t = tax(order, delivery);
    expect(t).toBe(0);
  });

  it('charges tax for hot items', () => {
    const order = {
      items: [
        {
          sku: 'P6-POTATO',
          title: '6-pack Potato',
          kind: 'hot',
          filling: 'potato',
          qty: 1,
          unitPriceCents: 699,
          addOns: []
        }
      ]
    };

    const delivery = { zone: 'local', rush: false };

    const t = tax(order, delivery);

    // Expect some positive tax for hot items (8% of 699 ≈ 55 cents)
    expect(t).toBeGreaterThan(0);
  });
});
