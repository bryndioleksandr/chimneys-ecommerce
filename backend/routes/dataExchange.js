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
import Category from "../models/category.js";
import SubCategory from "../models/subCategory.js";
import SubSubCategory from "../models/subSubCategory.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const exchangeRouter = express.Router();
const basCategory = "6970a4871f522c8c4da273af";

const CATEGORY_STRATEGIES = {
    "Нержавійка": "combine",
    "Оцинковка": "direct",
    "Сауна": "direct",
    "Термо": "direct",
    "default": "direct"
};

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

let previewResult = {};
let basIdIndex = {};
let objsWithIds = [];

const makeSlug = (name) => slugify(name, { lower: true, strict: true });

const syncCategoriesPreview = async(node, depth = 0, context = {}, currentTreePointer = previewResult) => {
    const groups = asArray(node);

    for (const group of groups) {
        const groupName = group.Наименование.trim();
        const basId = group.Ид;

        let newContext = { ...context };
        let nextTreePointer = currentTreePointer;

        if (depth === 0) {
        }

        else if (depth === 1) {
            const strategy = CATEGORY_STRATEGIES[groupName] || CATEGORY_STRATEGIES["default"];
            newContext.strategy = strategy;

            if (strategy === "combine") {
                newContext.namePrefix = groupName;
            }
            else if (strategy === "direct") {
                currentTreePointer[groupName] = {
                    type: "🔴 CATEGORY (Main)",
                    basId: basId,
                    children: {}
                };
                // const slug = makeSlug(groupName);
                const slug = makeSlug(groupName + "-" + basId.slice(6));
                const category = await Category.findOneAndUpdate(
                    { basGroupId: basId },
                    { name: groupName, slug: slug, basGroupId: basId },
                    { upsert: true, new: true }
                );
                // categoriesArray.push({basGroupId: basId, categoryId: category._id });
                objsWithIds.push({groupId: basId, obj:{categorySyncId:category._id, subcategorySyncId:null, subsubcategorySyncId:null,}})
                nextTreePointer = currentTreePointer[groupName].children;
               // newContext.categoryId = basId;
                newContext.categoryId = category._id;
            }
        }

        else if (depth === 2) {
            if (newContext.strategy === "combine") {
                const combinedName = `${newContext.namePrefix} ${groupName}`;

                // const slug = makeSlug(combinedName);
                const slug = makeSlug(groupName + "-" + basId.slice(6));

                const category = await Category.findOneAndUpdate(
                    { basGroupId: basId },
                    { name: combinedName, slug: slug, basGroupId: basId },
                    { upsert: true, new: true }
                );
                // categoriesArray.push({basGroupId: basId, categoryId: category._id });
                objsWithIds.push({groupId: basId, obj:{categorySyncId:category._id, subcategorySyncId:null, subsubcategorySyncId:null,}})

                currentTreePointer[combinedName] = {
                    type: "🔴 CATEGORY (Combined)",
                    basId: basId,
                    children: {}
                };
                nextTreePointer = currentTreePointer[combinedName].children;
                //newContext.categoryId = basId;
                newContext.categoryId = category._id;
            }
            else if (newContext.strategy === "direct") {
                if (newContext.categoryId) {
                    // const slug = makeSlug(groupName);
                    const slug = makeSlug(groupName + "-" + basId.slice(6));

                    currentTreePointer[groupName] = {
                        type: "🟡 SUB-CATEGORY",
                        basId: basId,
                        parentBasId: newContext.categoryId,
                        children: {}
                    };

                    const subCategory = await SubCategory.findOneAndUpdate(
                        { basGroupId: basId },
                        {
                            name: groupName,
                            slug: slug,
                            basGroupId: basId,
                            category: newContext.categoryId
                        },
                        { upsert: true, new: true }
                    );
                    //subcategoriesArray.push({basGroupId: basId, subcategoryId: subCategory._id });
                    objsWithIds.push({groupId: basId, obj:{categorySyncId: newContext.categoryId, subcategorySyncId:subCategory._id, subsubcategorySyncId:null,}})

                    nextTreePointer = currentTreePointer[groupName].children;
                    //newContext.subCategoryId = basId;
                    newContext.subCategoryId = subCategory._id;
                }
            }
        }

        else if (depth === 3) {
            if (newContext.strategy === "combine") {
                if (newContext.categoryId) {
                    // const slug = makeSlug(groupName);
                    const slug = makeSlug(groupName + "-" + basId.slice(6));

                    currentTreePointer[groupName] = {
                        type: "🟡 SUB-CATEGORY",
                        basId: basId,
                        parentBasId: newContext.categoryId,
                        children: {}
                    };

                    const subCategory = await SubCategory.findOneAndUpdate(
                        { basGroupId: basId },
                        {
                            name: groupName,
                            slug: slug,
                            basGroupId: basId,
                            category: newContext.categoryId
                        },
                        { upsert: true, new: true }
                    );
                    //subcategoriesArray.push({basGroupId: basId, subcategoryId: subCategory._id });
                    objsWithIds.push({groupId: basId, obj:{categorySyncId: newContext.categoryId, subcategorySyncId:subCategory._id, subsubcategorySyncId:null,}})

                    nextTreePointer = currentTreePointer[groupName].children;
                    // newContext.subCategoryId = basId;
                    newContext.subCategoryId = subCategory._id;

                }
            }
            else if (newContext.strategy === "direct") {
                if (newContext.subCategoryId) {
                    // const slug = makeSlug(groupName);
                    const slug = makeSlug(groupName + "-" + basId.slice(6));

                    currentTreePointer[groupName] = {
                        type: "🟢 SUB-SUB-CATEGORY",
                        basId: basId,
                        parentBasId: newContext.subCategoryId,
                        parentsParentBasId: newContext.categoryId
                    };
                    const subSubCategory = await SubSubCategory.findOneAndUpdate(
                        { basGroupId: basId },
                        {
                            name: groupName,
                            slug: slug,
                            basGroupId: basId,
                            subCategory: newContext.subCategoryId
                        },
                        { upsert: true, new: true }
                    );
                    //subsubcategoriesArray.push({basGroupId: basId, subsubcategoryId: subSubCategory._id });
                    objsWithIds.push({groupId: basId, obj:{categorySyncId: newContext.categoryId, subcategorySyncId:newContext.subCategoryId, subsubcategorySyncId:subSubCategory._id,}})

                }
            }
        }

        else if (depth === 4) {
            if (newContext.strategy === "combine") {
                if (newContext.subCategoryId) {
                    // const slug = makeSlug(groupName);
                    const slug = makeSlug(groupName + "-" + basId.slice(6));

                    currentTreePointer[groupName] = {
                        type: "🟢 SUB-SUB-CATEGORY",
                        basId: basId,
                        parentBasId: newContext.subCategoryId,
                        parentsParentBasId: newContext.categoryId
                    };

                    const subSubCategory = await SubSubCategory.findOneAndUpdate(
                        { basGroupId: basId },
                        {
                            name: groupName,
                            slug: slug,
                            basGroupId: basId,
                            subCategory: newContext.subCategoryId
                        },
                        { upsert: true, new: true }
                    );
                    // subsubcategoriesArray.push({basGroupId: basId, subsubcategoryId: subSubCategory._id });
                    objsWithIds.push({groupId: basId, obj:{categorySyncId: newContext.categoryId, subcategorySyncId:newContext.subCategoryId, subsubcategorySyncId:subSubCategory._id,}})

                }
            }
        }

        if (group.Группы && group.Группы.Группа) {
            await syncCategoriesPreview(group.Группы.Группа, depth + 1, newContext, nextTreePointer);
        }
    }
};


exchangeRouter.post('/', upload.any(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }


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

        if (groupsRoot.Группа) {

            await syncCategoriesPreview(groupsRoot.Группа);
        }

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

            const slugBas = `${baseSlug}-${basId.slice(0,8)}`;
            const found = objsWithIds.find(item => item.groupId === importData.groupBasId);

            const obj = found?.obj;

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
                            category: obj?.categorySyncId || basCategory,
                            subCategory: obj?.subcategorySyncId || null,
                            subSubCategory: obj?.subsubcategorySyncId || null,
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
//
exchangeRouter.get('/delete-last-150', async (req, res) => {
    try {
        const docs = await Product.find().sort({_id: -1}).limit(2300).select('_id');
        const ids = docs.map(d => d._id);

        const result = await Product.deleteMany({ _id: { $in: ids } });

        res.json({
            message: "Deleted successfully",
            count: result.deletedCount,
            ids: ids
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default exchangeRouter;
