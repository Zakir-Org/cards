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

function getRandomFloat(min, max, decimalPlaces = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimalPlaces));
}

async function main() {
    for (let i = 1; i <= 5; i++) {
        await createCardWithDetails(
            {
                bankOfCard: `Bank ${i}`,
                cardName: `Card ${i}`,
                cardType: 'Visa',
                interestYearly: getRandomFloat(1.0, 10.0),
            },
            {
                fuel: getRandomFloat(0.5, 5.0),
                store: getRandomFloat(0.5, 5.0),
                grocers: getRandomFloat(0.5, 5.0),
                other: getRandomFloat(0.5, 5.0),
            },
            {
                card2Card: getRandomFloat(500, 5000),
                interestCalc: getRandomFloat(100, 1000),
                maxAmount: getRandomFloat(5000, 50000),
                withdraw: getRandomFloat(100, 2000),
            },
        );
    }
    console.log('5 cards with related cashback and limits have been created with random values.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
