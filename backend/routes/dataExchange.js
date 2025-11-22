import express from 'express';
import multer from 'multer';
import xml2js from 'xml2js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const exchangeRouter = express.Router();

exchangeRouter.post('/', upload.single('file'), async (req, res) => {
    try {
        if (req.body.key !== 'secret_key_123') {
            return res.status(403).json({ error: 'Invalid API Key' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`Received a file from BAS: ${req.file.originalname}, size: ${req.file.size} bytes`);

        const xmlString = req.file.buffer.toString('utf-8');

        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlString);

        console.log('result after parse is: ', result);

        //todo: write parsing json to correct data

        console.log('Data processed successfully');
        res.status(200).json({ message: 'Sync successful' });

    } catch (error) {
        console.error('Error during processing:', error);
        res.status(500).json({ error: error.message });
    }
});

export default exchangeRouter;
