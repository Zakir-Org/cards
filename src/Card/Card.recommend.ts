import { Card, Cashback, PrismaClient } from '@prisma/client';
import { CardRequestBody, CardSingleRecommend } from './Card.types';
import { CardEvaluation } from './Card.evaluation';

export interface ICardRecommend {
    recommendSingleCard(body: CardRequestBody): Promise<CardSingleRecommend>;
}

export class CardRecommend implements ICardRecommend {
    constructor(private prisma: PrismaClient, private evaluation: CardEvaluation) {}

    public async recommendSingleCard(body: CardRequestBody): Promise<CardSingleRecommend> {
        try {
            // Get cards from db
            const cards = await this.prisma.card.findMany({
                include: {
                    cashback: true,
                },
            });

            // map and get each card result for savings and income
            const cardsWithIncome = cards.map((card) => {
                const cashbackIncome = this.evaluation.calculateTotalCashback(body.detailForCashback, card?.cashback as Cashback);
                const interestRateIncome = this.evaluation.calculateTotalInterestIncome(body.detailForInterest, card);

                return { ...card, cashbackIncome, interestRateIncome, totalIncome: cashbackIncome + interestRateIncome };
            });

            // Find the card with the highest total income
            const optimumCard = cardsWithIncome.reduce((maxCard, card) => {
                return maxCard.totalIncome > card.totalIncome ? maxCard : card;
            }, cardsWithIncome?.[0]);

            return optimumCard as CardSingleRecommend;
        } catch (error) {
            console.log('CardRecommend recommendSignleCard error', { error });
            return {} as CardSingleRecommend;
        }
    }
}
