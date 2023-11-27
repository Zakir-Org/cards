import { Request, Response } from 'express';
import cardRecommend from '../../Card';

export class CardController {
    public recommendSingleCard = async (req: Request, res: Response) => {
        try {
            const { body } = req;
            const result = await cardRecommend.recommendSingleCard(body);
            res.json(result).status(200);
        } catch (error) {
            console.error('CardController recommendSingleCard error', { error });
            res.json({ message: 'recommendSingleCard failed' }).status(500);
        }
    };
}
