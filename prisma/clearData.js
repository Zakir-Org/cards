const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.card.deleteMany({});
    await prisma.cashback.deleteMany({});
    await prisma.limits.deleteMany({});

    console.log('All data from cards, cashback, and limits have been deleted.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
