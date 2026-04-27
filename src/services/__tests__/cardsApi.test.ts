import MockAdapter from 'axios-mock-adapter';

import { axiosClient } from '../http/axiosClient';
import mockData from '../mockData.json';

// fetchCards is imported after we set up the adapter so the module-level mock
// in cardsApi.ts is replaced by our per-test adapter before any call is made.
import { fetchCards } from '../api/cardsApi';

describe('fetchCards', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Creating a new adapter on the shared axiosClient instance replaces any
    // previous adapter (including the module-level one in cardsApi.ts).
    mock = new MockAdapter(axiosClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('maps a 200 response to a FinancialCard array', async () => {
    mock.onGet('/v1/cards').reply(200, mockData);

    const cards = await fetchCards();

    expect(cards).toHaveLength(mockData.cards.length);
    expect(cards[0]?.id).toBe(mockData.cards[0]?.id);
    expect(cards[0]?.status.kind).toBe(mockData.cards[0]?.status.kind);
  });

  it('returns an empty array when the response body is missing the cards field', async () => {
    mock.onGet('/v1/cards').reply(200, { data: [] });

    const cards = await fetchCards();

    expect(cards).toEqual([]);
  });

  it('rejects with AppHttpError including status on a 500 response', async () => {
    mock.onGet('/v1/cards').reply(500);

    await expect(fetchCards()).rejects.toMatchObject({ status: 500 });
  });

  it('rejects with AppHttpError without status on a network error', async () => {
    mock.onGet('/v1/cards').networkError();

    await expect(fetchCards()).rejects.toMatchObject({
      message: expect.any(String),
      status: undefined,
    });
  });
});
