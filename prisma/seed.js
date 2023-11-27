const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCardWithDetails(cardData, cashbackData, limitsData) {
    const cashback = await prisma.cashback.create({ data: cashbackData });
    const limits = await prisma.limits.create({ data: limitsData });

    return await prisma.card.create({
        data: {
            ...cardData,
            cashbackId: cashback.id,
            limitsId: limits.id,
        },
    });
}

async function main() {
    for (let i = 1; i <= 5; i++) {
        await createCardWithDetails(
            { bankOfCard: `Bank ${i}`, cardName: `Card ${i}`, cardType: 'Visa', interestYearly: 5.0 + i },
            { fuel: 1.5 + i, store: 1.0 + i, grocers: 2.0 + i, other: 0.5 + i },
            { card2Card: 1000 * i, interestCalc: 200 * i, maxAmount: 10000 * i, withdraw: 500 * i },
        );
    }
    console.log('5 cards with related cashback and limits have been created.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
