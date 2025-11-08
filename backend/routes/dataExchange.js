import express from 'express';

const exchangeRouter = express.Router();

exchangeRouter.post('/', (req, res) => {
    console.log('body in exchange:', JSON.stringify(req.body));
    res.json(req.body);
});

export default exchangeRouter;
