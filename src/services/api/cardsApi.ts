import MockAdapter from 'axios-mock-adapter';

import type { FinancialCard } from '../../features/stepperFlow/types';
import { SIMULATE_CARDS_FETCH_FAILURE } from '../config';
import { axiosClient } from '../http/axiosClient';
import { mapCardsDto } from '../mappers/mapCardsDto';
import mockData from '../mockData.json';

// No real backend exists for this demo — mock-adapter intercepts all HTTP
// traffic to the fictitious base URL so Axios goes through its full pipeline
// (request config, interceptors, response shape) without making network calls.
//
// SIMULATE_CARDS_FETCH_FAILURE lets you manually verify the error toast in a
// simulator by flipping the flag in config.ts. Tests ignore this setup
// entirely: they mock this module with jest.mock() or create their own adapter
// on axiosClient before each case.
const _mock = new MockAdapter(axiosClient, { delayResponse: 800 });

if (SIMULATE_CARDS_FETCH_FAILURE) {
  _mock.onGet('/v1/cards').networkError();
} else {
  _mock.onGet('/v1/cards').reply(200, mockData);
}

export async function fetchCards(): Promise<FinancialCard[]> {
  const response = await axiosClient.get<unknown>('/v1/cards');
  return mapCardsDto(response.data);
}
