import { Card, Cashback, PrismaClient } from '@prisma/client';
import { CardCashbackInfo, CardInterestIncomeInfo, CardRequestBody } from './Card.types';

export interface ICardEvaluation {
    calculateTotalCashback(body: CardCashbackInfo, cashback: Cashback): number;
    calculateTotalInterestIncome(body: CardInterestIncomeInfo, card: Card): number;
}

export class CardEvaluation implements ICardEvaluation {
    constructor() {}

    public calculateTotalCashback(body: CardCashbackInfo, cashback: Cashback): number {
        try {
            const fuelIncome = CardEvaluation.calculateCategoryIncome(cashback?.fuel, body?.fuel);
            const grocersIncome = CardEvaluation.calculateCategoryIncome(cashback?.grocers, body?.grocers);
            const storeIncome = CardEvaluation.calculateCategoryIncome(cashback?.store, body?.store);
            const otherIncome = CardEvaluation.calculateCategoryIncome(cashback?.other, body?.other);

            return parseFloat((fuelIncome + grocersIncome + storeIncome + otherIncome).toFixed(2));
        } catch (error) {
            console.error('CardEvaluation calculateTotalCashback error', { error });
            return 0;
        }
    }

    public static calculateCategoryIncome(categoryRate: number | undefined, categorySpending: number | undefined): number {
        return ((categoryRate ?? 0) * (categorySpending ?? 0)) / 100;
    }

    public calculateTotalInterestIncome(body: CardInterestIncomeInfo, card: Card): number {
        try {
            const yearlyInterestIncome = ((body?.accountBalance || 0) * (card.interestYearly || 0)) / 100;
            const monthlyInterestIncome = (yearlyInterestIncome / 12).toFixed(2);

            return parseFloat(monthlyInterestIncome);
        } catch (error) {
            console.error('CardEvaluation calculateTotalInterestIncome error', { error });
            return 0;
        }
    }
}
