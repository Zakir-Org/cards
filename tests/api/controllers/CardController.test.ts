import { CardController } from '../../../src/api/controllers/CardController';
import { Request, Response } from 'express';
import { createSandbox } from 'sinon';
import cardRecommend from '../../../src/Card';
import { CardRequestBody, CardSingleRecommend } from '../../../src/Card/Card.types';
import { expect } from 'chai';
import { SinonStub } from 'sinon';
describe('CardController', () => {
    const sandbox = createSandbox();
    let errorStub: SinonStub;

    beforeEach(() => {
        errorStub = sandbox.stub(console, 'error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('recommendSingleCard', () => {
        it('should return success result', async () => {
            // Arrange
            const controller = new CardController();
            const recommendSingleCardStub = sandbox
                .stub(cardRecommend, 'recommendSingleCard')
                .resolves({ interestYearly: 5 } as CardSingleRecommend);
            const req = {
                body: {} as CardRequestBody,
            } as Request;

            const res = {
                json: sandbox.stub().returnsThis(),
                status: sandbox.stub().returnsThis(), // Stub status to return 'this' for chaining
            } as unknown as Response;
            // Act
            const result = await controller.recommendSingleCard(req, res);

            // Assert
            expect(recommendSingleCardStub.called).to.be.true;
        });

        it('should return error response', async () => {
            // Arrange
            const controller = new CardController();
            const recommendSingleCardStub = sandbox.stub(cardRecommend, 'recommendSingleCard').throws();
            const req = {
                body: {} as CardRequestBody,
            } as Request;

            const res = {
                json: sandbox.stub().returnsThis(),
                status: sandbox.stub().returnsThis(), // Stub status to return 'this' for chaining
            } as unknown as Response;
            // Act
            const result = await controller.recommendSingleCard(req, res);

            // Assert
            expect(recommendSingleCardStub.called).to.be.true;
            expect(errorStub.called).to.be.true;
        });
    });
});
