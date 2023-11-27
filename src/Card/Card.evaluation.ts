import { Card, Cashback, PrismaClient } from '@prisma/client';
import { CardCashbackInfo, CardInterestIncomeInfo } from './Card.types';

export interface ICardEvaluation {
    calculateTotalCashback(body: CardCashbackInfo): Promise<number>;
    calculateTotalInterestIncome(body: CardInterestIncomeInfo): number;
}

export class CardEvaluation implements ICardEvaluation {
    private cashback?: Cashback | null;

    constructor(private card: Card, private prisma: PrismaClient) {}

    public async loadCashbackData(): Promise<any> {
        return await this.prisma.cashback.findUnique({
            where: { id: this.card.cashbackId || undefined },
        });
    }

    public async calculateTotalCashback(body: CardCashbackInfo): Promise<number> {
        try {
            if (!this.cashback) {
                this.cashback = await this.loadCashbackData();
            }

            const fuelIncome = CardEvaluation.calculateCategoryIncome(this.cashback?.fuel, body?.fuel);
            const grocersIncome = CardEvaluation.calculateCategoryIncome(this.cashback?.grocers, body?.grocers);
            const storeIncome = CardEvaluation.calculateCategoryIncome(this.cashback?.store, body?.store);
            const otherIncome = CardEvaluation.calculateCategoryIncome(this.cashback?.other, body?.other);

            return parseFloat((fuelIncome + grocersIncome + storeIncome + otherIncome).toFixed(2));
        } catch (error) {
            console.error('CardEvaluation calculateTotalCashback error', { error });
            return 0;
        }
    }

    public static calculateCategoryIncome(categoryRate: number | undefined, categorySpending: number | undefined): number {
        return ((categoryRate ?? 0) * (categorySpending ?? 0)) / 100;
    }

    public calculateTotalInterestIncome(body: CardInterestIncomeInfo): number {
        try {
            const yearlyInterestIncome = ((body?.accountBalance || 0) * (this.card.interestYearly || 0)) / 100;
            const monthlyInterestIncome = (yearlyInterestIncome / 12).toFixed(2);

            return parseFloat(monthlyInterestIncome);
        } catch (error) {
            console.error('CardEvaluation calculateTotalInterestIncome error', { error });
            return 0;
        }
    }
}