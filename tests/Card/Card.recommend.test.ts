import { Card, Cashback, PrismaClient } from '@prisma/client';
import { CardRecommend } from '../../src/Card/Card.recommend';
import { stubInterface } from 'ts-sinon';
import { ICardEvaluation } from '../../src/Card/Card.evaluation';
import { CardRequestBody, CardSingleRecommend } from '../../src/Card/Card.types';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
describe.only('CardRecommend', () => {
    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('recommendSingleCard', () => {
        it('should recommend best card successfully', async () => {
            // Arrange
            const prisma = new PrismaClient();
            const stubEvaluation = stubInterface<ICardEvaluation>();

            const mockCards = [
                { id: 1, interestYearly: 5, cashback: { id: 1, fuel: 3, grocers: 1 } as Cashback } as unknown as Card,
                { id: 2, interestYearly: 5.5, cashback: { id: 2, fuel: 4, grocers: 2 } as Cashback } as unknown as Card,
                { id: 2, interestYearly: 3, cashback: { id: 2, fuel: 2, grocers: 2 } as Cashback } as unknown as Card,
            ];
            sandbox.stub(prisma.card, 'findMany').resolves(mockCards);

            const body = {
                detailForCashback: { fuel: 100, grocers: 50 },
                detailForInterest: { accountBalance: 500 },
            } as CardRequestBody;

            stubEvaluation.calculateTotalCashback.onFirstCall().returns(10);
            stubEvaluation.calculateTotalCashback.onSecondCall().returns(15);
            stubEvaluation.calculateTotalCashback.onThirdCall().returns(5);

            stubEvaluation.calculateTotalInterestIncome.onFirstCall().returns(100);
            stubEvaluation.calculateTotalInterestIncome.onSecondCall().returns(150);
            stubEvaluation.calculateTotalInterestIncome.onThirdCall().returns(50);

            const cardRecommend = new CardRecommend(prisma, stubEvaluation);
            // Act
            const result = await cardRecommend.recommendSingleCard(body);

            // Assert
            expect(result).to.be.eqls({} as CardSingleRecommend);
        });
    });
});
