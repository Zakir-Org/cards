import { Card, Cashback, PrismaClient } from '@prisma/client';
import { CardEvaluation } from '../../src/Card/Card.evaluation';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';
import { expect } from 'chai';
import { CardCashbackInfo, CardInterestIncomeInfo } from '../../src/Card/Card.types';

describe('Card', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('calculateCategoryIncome', () => {
        it('should correctly calculate income when both rate and spending are provided', () => {
            const result = CardEvaluation.calculateCategoryIncome(2, 100); // 2% of $100
            expect(result).to.equal(2); // Expect $2 as the income
        });

        it('should return 0 if rate is undefined', () => {
            const result = CardEvaluation.calculateCategoryIncome(undefined, 100);
            expect(result).to.equal(0);
        });

        it('should return 0 if spending is undefined', () => {
            const result = CardEvaluation.calculateCategoryIncome(2, undefined);
            expect(result).to.equal(0);
        });

        it('should return 0 if both rate and spending are undefined', () => {
            const result = CardEvaluation.calculateCategoryIncome(undefined, undefined);
            expect(result).to.equal(0);
        });
    });

    describe('calculateTotalCashback', () => {
        it('should calculate total cashbacks', async () => {
            // Arrange
            const card = {} as Card;
            const cashback = { fuel: 3, grocers: 1, store: 3, other: 0 } as Cashback;
            const body = { fuel: 100, store: 50, grocers: 200, other: 50 } as CardCashbackInfo;

            const prismaStub = stubInterface<PrismaClient>();
            const cardEvaluation = new CardEvaluation(card, prismaStub);
            sandbox.stub(cardEvaluation, 'loadCashbackData').resolves(cashback);
            sandbox.stub(CardEvaluation, 'calculateCategoryIncome').returns(10);

            // Act
            const result = await cardEvaluation.calculateTotalCashback(body);

            // Assert
            expect(result).to.be.eqls(40);
        });
    });

    describe('calculateTotalInterestIncome', () => {
        it('should calculate total income from yearly interest rate', async () => {
            // Arrange
            const card = { interestYearly: 5 } as Card;
            const body = { accountBalance: 1200 } as CardInterestIncomeInfo;

            const prismaStub = stubInterface<PrismaClient>();
            const cardEvaluation = new CardEvaluation(card, prismaStub);

            // Act
            const result = await cardEvaluation.calculateTotalInterestIncome(body);

            // Assert
            expect(result).to.be.eqls(5);
        });
    });
});
