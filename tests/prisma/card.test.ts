import { expect } from 'chai';
import { PrismaClient, Card } from '@prisma/client';

const prisma = new PrismaClient();

describe('Card Model', () => {
    let createdCardId: number;

    before(async () => {});

    after(async () => {
        // Cleanup: Delete any data created specifically for the tests
        await prisma.card.deleteMany();
        await prisma.$disconnect();
    });

    it('should create a new card', async () => {
        const cardData = {
            bankOfCard: 'Test Bank',
            cardName: 'Test Card',
            cardType: 'Visa',
            interestYearly: 5.0,
            cashback: {
                create: {
                    fuel: 2.0,
                    store: 1.5,
                    grocers: 1.0,
                    other: 0.5,
                },
            },
            limits: {
                create: {
                    card2Card: 10000,
                    interestCalc: 5000,
                    maxAmount: 20000,
                    withdraw: 3000,
                },
            },
        };

        const card = await prisma.card.create({ data: cardData });
        createdCardId = card.id; // Store the created card ID for later tests

        expect(card).to.be.an('object');
        expect(card.bankOfCard).to.equal(cardData.bankOfCard);
        // More assertions as necessary
    });

    it('should retrieve a card by id', async () => {
        const card = await prisma.card.findUnique({ where: { id: createdCardId } });
        expect(card).to.be.an('object');
        expect(card).to.have.property('id', createdCardId);
    });

    it('should retrieve a list of cards', async () => {
        const cards = await prisma.card.findMany();
        expect(cards).to.be.an('array');
        expect(cards.length).to.be.greaterThan(0);
    });

    it('should update a card', async () => {
        const updatedInterest = 6.0;
        const card = await prisma.card.update({
            where: { id: createdCardId },
            data: { interestYearly: updatedInterest },
        });

        expect(card).to.be.an('object');
        expect(card.interestYearly).to.equal(updatedInterest);
    });

    it('should delete a single card', async () => {
        await prisma.card.delete({ where: { id: createdCardId } });
        const card = await prisma.card.findUnique({ where: { id: createdCardId } });

        expect(card).to.be.null;
    });

    it('should delete all cards', async () => {
        await prisma.card.deleteMany();
        const cards = await prisma.card.findMany();

        expect(cards.length).to.equal(0);
    });
});
