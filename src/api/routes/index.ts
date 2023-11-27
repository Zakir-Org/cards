import { Router } from 'express';
import { CardController } from '../controllers/CardController';

const cardController = new CardController();

const router = Router();

// Define your API routes here
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

router.post('/recommendSingleCard', cardController.recommendSingleCard);

export default router;
