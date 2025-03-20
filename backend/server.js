import cors from 'cors';
import express from 'express';
import connectToDB from "./models/dbConnection.js";
import router from './routes/router.js';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.static(path.join(__dirname, '../front')));

app.use(router);

const startServer = async () => {
    try {
        await connectToDB();
        const PORT = process.env.PORT || 5501;
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Express server startup error:', error);
    }
}

startServer();
