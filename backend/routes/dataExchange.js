// import express from 'express';
// import multer from 'multer';
// import xml2js from 'xml2js';
// import Product from "../models/product.js";
// import slugify from "slugify";
//
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
//
// const exchangeRouter = express.Router();
//
// const basCategory = "6970a4871f522c8c4da273af";
//
// const asArray = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     return [data];
// };
//
// const createGroupMap = (groupsNode, map = {}) => {
//     const groups = asArray(groupsNode?.Группа);
//
//     groups.forEach(group => {
//         map[group.Ид] = group.Наименование;
//
//         if (group.Группы) {
//             createGroupMap(group.Группы, map);
//         }
//     });
//
//     return map;
// };
//
// const createProductGroupMap = (products) => {
//     const map = {};
//
//     const items = Array.isArray(products) ? products : [products];
//
//     items.forEach(product => {
//         const groupId = product.Группы?.Ид;
//
//         if (product.Ид && groupId) {
//             map[product.Ид] = groupId;
//         }
//     });
//
//     return map;
// };
//
// exchangeRouter.post('/', upload.any(), async (req, res) => {
//     try {
//         // if (req.body.key !== 'secret_key_123') {
//         //     return res.status(403).json({ error: 'Invalid API Key' });
//         // }
//
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ error: 'No files uploaded' });
//         }
//
//         let importFile, offersFile;
//         for(const file of req.files) {
//             if(file.originalname === "import.xml"){
//                 importFile = file;
//             }
//             else if(file.originalname === "offers.xml"){
//                 offersFile = file;
//             }
//         }
//
//         const xmlStringOffers = offersFile.buffer.toString('utf-8');
//         const xmlStringImport = importFile.buffer.toString('utf-8');
//
//         const parser = new xml2js.Parser({ explicitArray: false });
//         // const resultOffers = await parser.parseStringPromise(xmlStringOffers);
//         // const resultProductGroups = await parser.parseStringPromise(xmlStringImport);
//
//         const [resultProductGroups, resultOffers] = await Promise.all([
//             parser.parseStringPromise(importFile.buffer.toString('utf-8')),
//             parser.parseStringPromise(offersFile.buffer.toString('utf-8'))
//         ]);
//
//         const products = resultOffers.КоммерческаяИнформация.ПакетПредложений.Предложения.Предложение;
//         const productGroups = resultProductGroups.КоммерческаяИнформация.Классификатор.Группы;
//         const productsImport = resultProductGroups.КоммерческаяИнформация.Каталог.Товары.Товар;
//
//         const groupMap = createGroupMap(productGroups);
//         const productGroupMap = createProductGroupMap(productsImport);
//
//         // temp variant
//         // fetch products from offers.xml with details
//         try {
//             for (let i = 0; i < 5; i++) {
//                 const processedProduct = products[i];
//                 const slugBas = slugify(processedProduct.Наименование, {lower: true});
//                 const foundProduct = await Product.find({basId: processedProduct.Ид});
//                 console.log('id is:',  processedProduct.Ид)
//                 console.log('product found is: ', foundProduct);
//
//                 const processedProductGroup = productGroupMap[processedProduct.Ид];
//                 console.log('product group is:', processedProductGroup);
//                 const processedGroup = groupMap[processedProductGroup];
//                 console.log('processedGroup here is', processedGroup);
//
//                 if (foundProduct.length === 0) {
//                     const newProduct = new Product({
//                         productCode: processedProduct.Ид,
//                         category: basCategory,
//                         slug: slugBas,
//                         basId: processedProduct.Ид,
//                         basGroup: processedGroup,
//                         name: processedProduct.Наименование,
//                         price: processedProduct.Цены.Цена.ЦенаЗаЕдиницу,
//                         stock: processedProduct.Количество
//                     });
//                     await newProduct.save();
//                     console.log('data from bas was written successfully');
//                 } else {
//                     console.log('data is already in db, nothing new');
//                 }
//             }
//         }
//         catch(e){
//             console.error(e.message);
//         }
//         res.status(200).json({message: "finished"});
//         console.log('Data processed successfully');
//     } catch (error) {
//         console.error('Error during processing:', error);
//         res.status(500).json({ error: error.message });
//     }
// });
//
// export default exchangeRouter;

import express from 'express';
import multer from 'multer';
import xml2js from 'xml2js';
import Product from "../models/product.js";
import slugify from "slugify";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const exchangeRouter = express.Router();
const basCategory = "6970a4871f522c8c4da273af";

const asArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
};

const createGroupMap = (groupsNode, map = {}) => {
    const groups = asArray(groupsNode?.Группа);
    groups.forEach(group => {
        map[group.Ид] = group.Наименование;
        if (group.Группы) createGroupMap(group.Группы, map);
    });
    return map;
};

const createImportDataMap = (products, groupMap) => {
    const map = {};
    const items = asArray(products);

    items.forEach(product => {
        const groupId = product.Группы?.Ид;
        const groupName = groupId ? groupMap[groupId] : "Інше";

        if (product.Ид) {
            map[product.Ид] = {
                groupBasId: groupId,
                categoryName: groupName,
                description: product.Описание || "",
                name: product.Наименование
            };
        }
    });
    return map;
};

exchangeRouter.post('/', upload.any(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        console.log(`start processing ${req.files.length} files`);

        const importFile = req.files.find(f => f.originalname.includes("import"));
        const offersFile = req.files.find(f => f.originalname.includes("offers"));

        if (!importFile || !offersFile) {
            return res.status(400).json({ error: 'both import.xml and offers.xml are required' });
        }

        const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

        const [resultImport, resultOffers] = await Promise.all([
            parser.parseStringPromise(importFile.buffer.toString('utf-8')),
            parser.parseStringPromise(offersFile.buffer.toString('utf-8'))
        ]);

        const groupsRoot = resultImport.КоммерческаяИнформация?.Классификатор?.Группы;
        const productsImport = resultImport.КоммерческаяИнформация?.Каталог?.Товары?.Товар;

        const groupMap = createGroupMap(groupsRoot);
        const importDataMap = createImportDataMap(productsImport, groupMap);

        const offersList = asArray(resultOffers.КоммерческаяИнформация?.ПакетПредложений?.Предложения?.Предложение);

        console.log(`processing ${offersList.length} products`);

        const bulkOps = offersList.map(offer => {
            let price = 0;
            const rawPrice = offer.Цены?.Цена;
            if (Array.isArray(rawPrice)) {
                price = parseFloat(rawPrice[0].ЦенаЗаЕдиницу);
            } else if (rawPrice) {
                price = parseFloat(rawPrice.ЦенаЗаЕдиницу);
            }

            const basId = offer.Ид;
            const stock = parseFloat(offer.Количество || 0);

            const importData = importDataMap[basId] || {};
            const productName = offer.Наименование;


// idea: make slug a little dirty to avoid conflicts in a way by adding basid 4 symbols to the end of normalized slug    ||||    or skip products

            const normalizedName = productName.replace(/[+-]+/g, match => {
                const symbol = match[0];
                const count = match.length;

                if (symbol === '+') {
                    return ' plus'.repeat(count).trim().replace(/ /g, '-');
                }

                if (symbol === '-') {
                    return ' minus'.repeat(count).trim().replace(/ /g, '-');
                }

                return match;
            });

            const baseSlug = slugify(normalizedName, {
                lower: true,
                strict: true,
                trim: true
            });

            const slugBas = `${baseSlug}-${basId.slice(basId.length-4, basId.length)}`;

            console.log('name of the product:', productName);
            console.log('slug bas for this product:', slugBas);

            return {
                updateOne: {
                    filter: { basId: basId },
                    update: {
                        $set: {
                            name: productName,
                            price: price,
                            stock: stock,
                            productCode: basId,

                            basGroup: importData.categoryName,
                            groupBasId: importData.groupBasId,

                        },
                        $setOnInsert: {
                            slug: slugBas,
                            category: basCategory,
                        }
                    },
                    upsert: true
                }
            };
        });

        if (bulkOps.length > 0) {
            await Product.bulkWrite(bulkOps);
            console.log(`successfully synced ${bulkOps.length} products`);
        }

        res.status(200).json({
            message: "sync finished",
            count: bulkOps.length
        });

    } catch (error) {
        console.error('error during processing:', error);
        res.status(500).json({ error: error.message });
    }
});

// exchangeRouter.get('/delete-last-150', async (req, res) => {
//     try {
//         const docs = await Product.find().sort({_id: -1}).limit(145).select('_id');
//         const ids = docs.map(d => d._id);
//
//         const result = await Product.deleteMany({ _id: { $in: ids } });
//
//         res.json({
//             message: "Deleted successfully",
//             count: result.deletedCount,
//             ids: ids
//         });
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

export default exchangeRouter;
