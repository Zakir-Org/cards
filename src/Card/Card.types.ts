import { Card } from '@prisma/client';

export interface CardCashbackInfo {
    fuel: number;
    store: number;
    grocers: number;
    other: number;
}

export interface CardInterestIncomeInfo {
    accountBalance: number;
    // Add more fields if needed
}

export interface CardSingleRecommend extends Card {
    interestRateIncome?: number;
    cashbackIncome?: number;
    totalIncome: number;
}

export interface CardRequestBody {
    detailForCashback: CardCashbackInfo;
    detailForInterest: CardInterestIncomeInfo;
}
