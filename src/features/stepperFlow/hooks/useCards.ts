import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { showErrorToast } from '../../../app/toast/showErrorToast';
import { fetchCards } from '../../../services/api/cardsApi';
import type { AppHttpError } from '../../../services/http/axiosClient';
import type { FinancialCard } from '../types';

export interface UseCardsResult {
  cards: FinancialCard[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCards(): UseCardsResult {
  const { t } = useTranslation();
  const [cards, setCards] = useState<FinancialCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCards();
      setCards(data);
    } catch (err) {
      const appError = err as AppHttpError;
      const message =
        appError.status !== undefined ? t('errors.cardsLoadFailed') : t('errors.network');
      setError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  return { cards, isLoading, error, refetch: load };
}
