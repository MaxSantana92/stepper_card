export interface CardStatusDto {
  kind: string;
  reason?: string;
  pausedAt?: string;
  resumedAt?: string;
}

export interface FinancialCardDto {
  id: string;
  type: string;
  lastFour: string;
  holderName: string;
  status: CardStatusDto;
  balance: number;
  expiryDate: string;
}

export interface CardsResponseDto {
  cards: FinancialCardDto[];
}
