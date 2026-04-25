import type { CardStatusKind } from '../../features/stepperFlow/types';

interface MockCardStatus {
  kind: CardStatusKind;
  reason?: string;
  pausedAt?: string;
  resumedAt?: string;
}

const mockData = require('../mockData.json') as {
  cards: Array<{
    id: string;
    type: string;
    lastFour: string;
    holderName: string;
    status: MockCardStatus;
    balance: number;
    expiryDate: string;
  }>;
};

const expectedStatuses: readonly CardStatusKind[] = ['enabled', 'disabled', 'paused', 'unpaused'];

describe('mockData contract', () => {
  it('contains all card status kinds required by the stepper flow', () => {
    const statusKinds = new Set(mockData.cards.map((card) => card.status.kind));

    expect(statusKinds.size).toBe(expectedStatuses.length);
    for (const status of expectedStatuses) {
      expect(statusKinds.has(status)).toBe(true);
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
      expect(card.status.kind).toBeTruthy();
    }
  });
});
