import express from 'express';
const debugRouter = express.Router();

debugRouter.use(express.raw({ type: '*/*', limit: '50mb' }));

debugRouter.all('/', (req, res) => {
    try {
        console.log('\n🔥 ================= NEW REQUEST FROM BAS ================= 🔥');

        console.log(`METHOD: ${req.method}`);
        console.log(`URL Query Params:`, req.query);

        console.log('📋 HEADERS:', JSON.stringify(req.headers, null, 2));

        // 3. Дивимось ТІЛО запиту
        if (req.body && Buffer.isBuffer(req.body)) {
            const bodyString = req.body.toString('utf-8');

            console.log(`📦 BODY SIZE: ${req.body.length} bytes`);

            console.log('👀 BODY PREVIEW (First 500 chars):');
            console.log('-----------------------------------');
            console.log(bodyString.slice(0, 2000));
            console.log('-----------------------------------');
        } else {
            console.log('EMPTY BODY');
        }

        res.status(200).send('Connection successful. Data received.');

    } catch (error) {
        console.error('Debug Error:', error);
        res.status(200).send('Error logged but connection ok');
    }
});

export default debugRouter;
