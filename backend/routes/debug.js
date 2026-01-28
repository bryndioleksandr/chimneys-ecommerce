// import express from 'express';
// const debugRouter = express.Router();
//
// debugRouter.use(express.raw({ type: '*/*', limit: '50mb' }));
//
// // debugRouter.all('/', (req, res) => {
// //     try {
// //         console.log('\n🔥 ================= NEW REQUEST FROM BAS ================= 🔥');
// //
// //         console.log(`METHOD: ${req.method}`);
// //         console.log(`URL Query Params:`, req.query);
// //
// //         console.log('📋 HEADERS:', JSON.stringify(req.headers, null, 2));
// //
// //         // 3. Дивимось ТІЛО запиту
// //         if (req.body && Buffer.isBuffer(req.body)) {
// //             const bodyString = req.body.toString('utf-8');
// //
// //             console.log(`📦 BODY SIZE: ${req.body.length} bytes`);
// //
// //             console.log('👀 BODY PREVIEW (First 500 chars):');
// //             console.log('-----------------------------------');
// //             console.log(bodyString.slice(0, 2000));
// //             console.log('-----------------------------------');
// //         } else {
// //             console.log('EMPTY BODY');
// //         }
// //
// //         res.status(200).send('Connection successful. Data received.');
// //
// //     } catch (error) {
// //         console.error('Debug Error:', error);
// //         res.status(200).send('Error logged but connection ok');
// //     }
// // });
//
//
//
// export default debugRouter;

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const debugRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, '../temp_1c');

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

debugRouter.use(express.raw({ type: '*/*', limit: '100mb' }));

debugRouter.all('/', async (req, res) => {
    const mode = req.query.mode;
    const type = req.query.type;
    const filename = req.query.filename;

    console.log(`\n🔔 1C REQUEST: mode=${mode}, type=${type}, filename=${filename}`);

    try {

        if (mode === 'checkauth') {
            console.log('Auth success emulated');
            return res.send("success\nPHPSESSID=74012304857230948572039485");
        }

        if (mode === 'init') {
            console.log('Init success emulated');
            return res.send("zip=no\nfile_limit=100000000");
        }


        if (mode === 'file') {
            if (!filename) return res.status(400).send("filename required");

            const filePath = path.join(TEMP_DIR, filename);


            fs.writeFileSync(filePath, req.body);

            console.log(`File saved: ${filename} (${req.body.length} bytes)`);
            return res.send("success");
        }


        if (mode === 'import') {
            console.log('Triggering import logic...');

            const hasImport = fs.existsSync(path.join(TEMP_DIR, 'import.xml'));
            const hasOffers = fs.existsSync(path.join(TEMP_DIR, 'offers.xml'));

            if (hasImport && hasOffers) {
                console.log('Both files are here. Ready to parse.');
            }

            return res.send("success");
        }

        return res.send("success");

    } catch (error) {
        console.error('Error:', error);
        res.send("failure\n" + error.message);
    }
});

export default debugRouter;
