import type { FinancialCard } from '../../features/stepperFlow/types';
import type { CardsResponseDto } from '../types/cards.dto';

export function mapCardsDto(data: unknown): FinancialCard[] {
  if (
    typeof data !== 'object' ||
    data === null ||
    !Array.isArray((data as CardsResponseDto).cards)
  ) {
    return [];
  }
  return (data as CardsResponseDto).cards as FinancialCard[];
}
