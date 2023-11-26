-- CreateTable
CREATE TABLE "Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bankOfCard" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "interestYearly" REAL NOT NULL,
    "cashbackId" INTEGER,
    "limitsId" INTEGER,
    CONSTRAINT "Card_cashbackId_fkey" FOREIGN KEY ("cashbackId") REFERENCES "Cashback" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_limitsId_fkey" FOREIGN KEY ("limitsId") REFERENCES "Limits" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cashback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fuel" REAL NOT NULL,
    "store" REAL NOT NULL,
    "grocers" REAL NOT NULL,
    "other" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Limits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "card2Card" REAL NOT NULL,
    "interestCalc" REAL NOT NULL,
    "maxAmount" REAL NOT NULL,
    "withdraw" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_cashbackId_key" ON "Card"("cashbackId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_limitsId_key" ON "Card"("limitsId");
