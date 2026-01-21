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

        if (group.Группы) {
            createGroupMap(group.Группы, map);
        }
    });

    return map;
};

const createProductGroupMap = (products) => {
    const map = {};

    const items = Array.isArray(products) ? products : [products];

    items.forEach(product => {
        const groupId = product.Группы?.Ид;

        if (product.Ид && groupId) {
            map[product.Ид] = groupId;
        }
    });

    return map;
};

exchangeRouter.post('/', upload.any(), async (req, res) => {
    try {
        // if (req.body.key !== 'secret_key_123') {
        //     return res.status(403).json({ error: 'Invalid API Key' });
        // }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        let importFile, offersFile;
        for(const file of req.files) {
            if(file.originalname === "import.xml"){
                importFile = file;
            }
            else if(file.originalname === "offers.xml"){
                offersFile = file;
            }
        }

        const xmlStringOffers = offersFile.buffer.toString('utf-8');
        const xmlStringImport = importFile.buffer.toString('utf-8');

        const parser = new xml2js.Parser({ explicitArray: false });
        const resultOffers = await parser.parseStringPromise(xmlStringOffers);
        const resultProductGroups = await parser.parseStringPromise(xmlStringImport);

        const products = resultOffers.КоммерческаяИнформация.ПакетПредложений.Предложения.Предложение;
        const productGroups = resultProductGroups.КоммерческаяИнформация.Классификатор.Группы;
        const productsImport = resultProductGroups.КоммерческаяИнформация.Каталог.Товары.Товар;

        const groupMap = createGroupMap(productGroups);
        const productGroupMap = createProductGroupMap(productsImport);

        // temp variant
        // fetch products from offers.xml with details
        try {
            for (let i = 0; i < 5; i++) {
                const processedProduct = products[i];
                const slugBas = slugify(processedProduct.Наименование, {lower: true});
                const foundProduct = await Product.find({basId: processedProduct.Ид});
                console.log('id is:',  processedProduct.Ид)
                console.log('product found is: ', foundProduct);

                const processedProductGroup = productGroupMap[processedProduct.Ид];
                console.log('product group is:', processedProductGroup);
                const processedGroup = groupMap[processedProductGroup];
                console.log('processedGroup here is', processedGroup);

                if (foundProduct.length === 0) {
                    const newProduct = new Product({
                        productCode: processedProduct.Ид,
                        category: basCategory,
                        slug: slugBas,
                        basId: processedProduct.Ид,
                        basGroup: processedGroup,
                        name: processedProduct.Наименование,
                        price: processedProduct.Цены.Цена.ЦенаЗаЕдиницу,
                        stock: processedProduct.Количество
                    });
                    await newProduct.save();
                    console.log('data from bas was written successfully');
                } else {
                    console.log('data is already in db, nothing new');
                }
            }
        }
        catch(e){
            console.error(e.message);
        }
        res.status(200).json({message: "finished"});
        console.log('Data processed successfully');
    } catch (error) {
        console.error('Error during processing:', error);
        res.status(500).json({ error: error.message });
    }
});

export default exchangeRouter;
