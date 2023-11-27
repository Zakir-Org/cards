import { PrismaClient } from '@prisma/client';
import { CardRecommend } from './Card.recommend';
import { CardEvaluation } from './Card.evaluation';

const prisma = new PrismaClient();
const cardEvaluation = new CardEvaluation();
const cardRecommend = new CardRecommend(prisma, cardEvaluation);
export default cardRecommend;
