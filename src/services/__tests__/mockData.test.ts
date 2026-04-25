const mockData = require('../mockData.json') as {
  cards: Array<{
    id: string;
    type: string;
    lastFour: string;
    holderName: string;
    status: 'enabled' | 'disabled' | 'paused' | 'unpaused';
    balance: number;
    expiryDate: string;
  }>;
};

const expectedStatuses = ['enabled', 'disabled', 'paused', 'unpaused'] as const;

describe('mockData contract', () => {
  it('contains all card statuses required by the stepper flow', () => {
    const statuses = new Set(mockData.cards.map((card) => card.status));

    expect(statuses.size).toBe(expectedStatuses.length);
    for (const status of expectedStatuses) {
      expect(statuses.has(status)).toBe(true);
    }
  });

  it('exposes the minimum fields required by StatusCard', () => {
    for (const card of mockData.cards) {
      expect(card.id).toBeTruthy();
      expect(card.type).toBeTruthy();
      expect(card.lastFour).toHaveLength(4);
      expect(card.holderName).toBeTruthy();
      expect(card.expiryDate).toBeTruthy();
      expect(Number.isFinite(card.balance)).toBe(true);
    }
  });
});
