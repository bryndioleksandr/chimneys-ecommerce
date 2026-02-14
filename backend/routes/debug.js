// // import express from 'express';
// // const debugRouter = express.Router();
// //
// // debugRouter.use(express.raw({ type: '*/*', limit: '50mb' }));
// //
// // // debugRouter.all('/', (req, res) => {
// // //     try {
// // //         console.log('\n🔥 ================= NEW REQUEST FROM BAS ================= 🔥');
// // //
// // //         console.log(`METHOD: ${req.method}`);
// // //         console.log(`URL Query Params:`, req.query);
// // //
// // //         console.log('📋 HEADERS:', JSON.stringify(req.headers, null, 2));
// // //
// // //         // 3. Дивимось ТІЛО запиту
// // //         if (req.body && Buffer.isBuffer(req.body)) {
// // //             const bodyString = req.body.toString('utf-8');
// // //
// // //             console.log(`📦 BODY SIZE: ${req.body.length} bytes`);
// // //
// // //             console.log('👀 BODY PREVIEW (First 500 chars):');
// // //             console.log('-----------------------------------');
// // //             console.log(bodyString.slice(0, 2000));
// // //             console.log('-----------------------------------');
// // //         } else {
// // //             console.log('EMPTY BODY');
// // //         }
// // //
// // //         res.status(200).send('Connection successful. Data received.');
// // //
// // //     } catch (error) {
// // //         console.error('Debug Error:', error);
// // //         res.status(200).send('Error logged but connection ok');
// // //     }
// // // });
// //
// //
// //
// // export default debugRouter;
//
// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import {fileURLToPath} from 'url';
//
// const debugRouter = express.Router();
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const TEMP_DIR = path.join(__dirname, '../temp_1c');
//
// if (!fs.existsSync(TEMP_DIR)) {
//     fs.mkdirSync(TEMP_DIR, {recursive: true});
// }
//
// debugRouter.use(express.raw({type: '*/*', limit: '100mb'}));
//
// debugRouter.all('/', async (req, res) => {
//     const mode = req.query.mode;
//     const type = req.query.type;
//     const filename = req.query.filename;
//
//     console.log(`\n🔔 1C REQUEST: mode=${mode}, type=${type}, filename=${filename}`);
//     console.log('📋 HEADERS:', JSON.stringify(req.headers, null, 2));
//
//     try {
//
//         if (mode === 'checkauth') {
//             console.log('Auth success emulated');
//             return res.send("success\nPHPSESSID=74012304857230948572039485");
//         }
//
//         if (mode === 'init') {
//             console.log('Init success emulated');
//             return res.send("zip=no\nfile_limit=100000000");
//         }
//
//
//         if (mode === 'file') {
//             if (!filename) return res.status(400).send("filename required");
//
//             const filePath = path.join(TEMP_DIR, filename);
//
//
//             fs.writeFileSync(filePath, req.body);
//
//             console.log(`File saved: ${filename} (${req.body.length} bytes)`);
//             return res.send("success");
//         }
//
//
//         if (mode === 'import') {
//             console.log('Triggering import logic...');
//
//             const hasImport = fs.existsSync(path.join(TEMP_DIR, 'import.xml'));
//             const hasOffers = fs.existsSync(path.join(TEMP_DIR, 'offers.xml'));
//
//             if (hasImport && hasOffers) {
//                 console.log('Both files are here. Ready to parse.');
//             }
//
//             return res.send("success");
//         }
//
//         return res.send("success");
//
//     } catch (error) {
//         console.error('Error:', error);
//         res.send("failure\n" + error.message);
//     }
// });
//
// export default debugRouter;

import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import xml2js from 'xml2js';
import slugify from "slugify";


import Product from "../models/product.js";
import Category from "../models/category.js";
import SubCategory from "../models/subCategory.js";
import SubSubCategory from "../models/subSubCategory.js";

const debugRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, '../temp_1c');

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, {recursive: true});
}

let previewResult = {};
let objsWithIds = [];

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

const makeSlug = (name) => slugify(name, {lower: true, strict: true});

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

const syncCategoriesPreview = async (node, depth = 0, context = {}, currentTreePointer = previewResult) => {
    const groups = asArray(node);

    for (const group of groups) {
        const groupName = group.Наименование.trim();
        const basId = group.Ид;

        let newContext = {...context};
        let nextTreePointer = currentTreePointer;

        if (depth === 0) {
        } else if (depth === 1) {
            const strategy = CATEGORY_STRATEGIES[groupName] || CATEGORY_STRATEGIES["default"];
            newContext.strategy = strategy;

            if (strategy === "combine") {
                newContext.namePrefix = groupName;
            } else if (strategy === "direct") {
                currentTreePointer[groupName] = {type: "🔴 CATEGORY (Main)", basId: basId, children: {}};
                const slug = makeSlug(groupName + "-" + basId.slice(6));

                const category = await Category.findOneAndUpdate(
                    {basGroupId: basId},
                    {
                        $set: {
                            basGroupId: basId
                        },
                        $setOnInsert: {
                            name: groupName, slug: slug
                        }
                    },
                    {upsert: true, new: true}
                );

                objsWithIds.push({
                    groupId: basId,
                    obj: {categorySyncId: category._id, subcategorySyncId: null, subsubcategorySyncId: null,}
                })
                nextTreePointer = currentTreePointer[groupName].children;
                newContext.categoryId = category._id;
            }
        } else if (depth === 2) {
            if (newContext.strategy === "combine") {
                const combinedName = `${newContext.namePrefix} ${groupName}`;
                const slug = makeSlug(groupName + "-" + basId.slice(6));

                const category = await Category.findOneAndUpdate(
                    {basGroupId: basId},
                    {
                        $set: {
                            basGroupId: basId
                        },
                        $setOnInsert: {
                            name: combinedName, slug: slug,
                        }
                    },
                    {upsert: true, new: true}
                );

                objsWithIds.push({
                    groupId: basId,
                    obj: {categorySyncId: category._id, subcategorySyncId: null, subsubcategorySyncId: null,}
                })
                currentTreePointer[combinedName] = {type: "🔴 CATEGORY (Combined)", basId: basId, children: {}};
                nextTreePointer = currentTreePointer[combinedName].children;
                newContext.categoryId = category._id;
            } else if (newContext.strategy === "direct") {
                if (newContext.categoryId) {
                    const slug = makeSlug(groupName + "-" + basId.slice(6));
                    currentTreePointer[groupName] = {
                        type: "🟡 SUB-CATEGORY",
                        basId: basId,
                        parentBasId: newContext.categoryId,
                        children: {}
                    };

                    const subCategory = await SubCategory.findOneAndUpdate(
                        {basGroupId: basId},
                        {
                            $set: {
                                basGroupId: basId
                            },
                            $setOnInsert: {
                                name: groupName, slug: slug,  category: newContext.categoryId
                            },
                        },
                        {upsert: true, new: true}
                    );

                    objsWithIds.push({
                        groupId: basId,
                        obj: {
                            categorySyncId: newContext.categoryId,
                            subcategorySyncId: subCategory._id,
                            subsubcategorySyncId: null,
                        }
                    })
                    nextTreePointer = currentTreePointer[groupName].children;
                    newContext.subCategoryId = subCategory._id;
                }
            }
        } else if (depth === 3) {
            if (newContext.strategy === "combine") {
                if (newContext.categoryId) {
                    const slug = makeSlug(groupName + "-" + basId.slice(6));
                    currentTreePointer[groupName] = {
                        type: "🟡 SUB-CATEGORY",
                        basId: basId,
                        parentBasId: newContext.categoryId,
                        children: {}
                    };

                    const subCategory = await SubCategory.findOneAndUpdate(
                        {basGroupId: basId},
                        {
                            $set: {
                                basGroupId: basId
                            },
                            $setOnInsert: {
                                name: groupName, slug: slug, category: newContext.categoryId
                            }
                        },
                        {upsert: true, new: true}
                    );

                    objsWithIds.push({
                        groupId: basId,
                        obj: {
                            categorySyncId: newContext.categoryId,
                            subcategorySyncId: subCategory._id,
                            subsubcategorySyncId: null,
                        }
                    })
                    nextTreePointer = currentTreePointer[groupName].children;
                    newContext.subCategoryId = subCategory._id;
                }
            } else if (newContext.strategy === "direct") {
                if (newContext.subCategoryId) {
                    const slug = makeSlug(groupName + "-" + basId.slice(6));
                    currentTreePointer[groupName] = {
                        type: "🟢 SUB-SUB-CATEGORY",
                        basId: basId,
                        parentBasId: newContext.subCategoryId
                    };

                    const subSubCategory = await SubSubCategory.findOneAndUpdate(
                        {basGroupId: basId},
                        {
                            $set: {
                                basGroupId: basId,
                            },
                            $setOnInsert: {
                                name: groupName,
                                slug: slug,
                                subCategory: newContext.subCategoryId
                            }
                        },
                        {upsert: true, new: true}
                    );

                    objsWithIds.push({
                        groupId: basId,
                        obj: {
                            categorySyncId: newContext.categoryId,
                            subcategorySyncId: newContext.subCategoryId,
                            subsubcategorySyncId: subSubCategory._id,
                        }
                    })
                }
            }
        } else if (depth === 4) {
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
                        {basGroupId: basId},
                        {
                            $set: {
                                basGroupId: basId,
                            },
                            $setOnInsert: {
                                name: groupName,
                                slug: slug,
                                subCategory: newContext.subCategoryId
                            }
                        },
                        {upsert: true, new: true}
                    );
                    // subsubcategoriesArray.push({basGroupId: basId, subsubcategoryId: subSubCategory._id });
                    objsWithIds.push({
                        groupId: basId,
                        obj: {
                            categorySyncId: newContext.categoryId,
                            subcategorySyncId: newContext.subCategoryId,
                            subsubcategorySyncId: subSubCategory._id,
                        }
                    })

                }
            }
        }


        if (group.Группы && group.Группы.Группа) {
            await syncCategoriesPreview(group.Группы.Группа, depth + 1, newContext, nextTreePointer);
        }
    }
};


debugRouter.use(express.raw({type: '*/*', limit: '100mb'}));

debugRouter.all('/', async (req, res) => {
    const mode = req.query.mode;
    const type = req.query.type;
    const filename = req.query.filename;

    const userAgent = req.headers['user-agent'] || 'Unknown';
    console.log(`\n🔔 1C REQ: ${mode} | File: ${filename} | Agent: ${userAgent}`);

    try {
        if (mode === 'checkauth') {
            return res.send("success\nPHPSESSID=74012304857230948572039485");
        }

        if (mode === 'init') {
            return res.send("zip=no\nfile_limit=100000000");
        }

        if (mode === 'file') {
            if (!filename) return res.status(400).send("filename required");
            const filePath = path.join(TEMP_DIR, filename);
            fs.writeFileSync(filePath, req.body);
            console.log(`💾 Saved: ${filename}`);
            return res.send("success");
        }

        if (mode === 'import') {
            console.log('Triggering import logic...');

            const importPath = path.join(TEMP_DIR, 'import.xml');
            const offersPath = path.join(TEMP_DIR, 'offers.xml');

            if (fs.existsSync(importPath) && fs.existsSync(offersPath)) {
                console.log('📦 Reading files from disk...');

                objsWithIds = [];
                previewResult = {};

                const [importXml, offersXml] = await Promise.all([
                    fs.promises.readFile(importPath, 'utf-8'),
                    fs.promises.readFile(offersPath, 'utf-8')
                ]);

                const parser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true});
                const [resultImport, resultOffers] = await Promise.all([
                    parser.parseStringPromise(importXml),
                    parser.parseStringPromise(offersXml)
                ]);

                const groupsRoot = resultImport.КоммерческаяИнформация?.Классификатор?.Группы;
                const productsImport = resultImport.КоммерческаяИнформация?.Каталог?.Товары?.Товар;

                const groupMap = createGroupMap(groupsRoot);
                const importDataMap = createImportDataMap(productsImport, groupMap);

                // if (groupsRoot?.Группа) {
                //     console.log("Generating tree of categories...");
                //     await syncCategoriesPreview(groupsRoot.Группа);
                //     console.log("Categories synced.");
                // }

                const offersList = asArray(resultOffers.КоммерческаяИнформация?.ПакетПредложений?.Предложения?.Предложение);
                console.log(`📦 Processing ${offersList.length} products...`);

                const baseCatName = "Товари з BAS"
                const baseCategorySlug = slugify(baseCatName, { lower: true, strict: true });

                const baseCategory = await Category.findOneAndUpdate(
                    { name: baseCatName },
                    { $setOnInsert: { name: baseCatName, slug: baseCategorySlug } },
                    { new: true, upsert: true }
                );

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

                    const normalizedName = productName.replace(/[+-]+/g, match => {
                        const symbol = match[0];
                        const count = match.length;
                        if (symbol === '+') return ' plus'.repeat(count).trim().replace(/ /g, '-');
                        if (symbol === '-') return ' minus'.repeat(count).trim().replace(/ /g, '-');
                        return match;
                    });

                    const baseSlug = slugify(normalizedName, {lower: true, strict: true, trim: true});
                    const slugBas = `${baseSlug}-${basId.slice(0, 8)}`;

                    // const found = objsWithIds.find(item => item.groupId === importData.groupBasId);
                    // const obj = found?.obj;


                    return {
                        updateOne: {
                            filter: {basId: basId},
                            update: {
                                $set: {
                                    price: price,
                                    stock: stock,
                                    productCode: basId,
                                    basGroup: importData.categoryName,
                                    groupBasId: importData.groupBasId,
                                },
                                $setOnInsert: {
                                    name: productName,
                                    slug: slugBas,
                                    category: baseCategory._id
                                   // category: obj?.categorySyncId || basCategory,
                                    // subCategory: obj?.subcategorySyncId || null,
                                    // subSubCategory: obj?.subsubcategorySyncId || null,
                                }
                            },
                            upsert: true
                        }
                    };
                });

                if (bulkOps.length > 0) {
                    const result = await Product.bulkWrite(bulkOps);
                    console.log(`SYNC COMPLETE!`);
                    console.log(`-------------------------------------------`);
                    console.log(`🟢 Inserted (New):     ${result.upsertedCount}`);
                    console.log(`🔵 Modified (Updated): ${result.modifiedCount}`);
                    console.log(`⚪ Matched (No change): ${result.matchedCount}`);
                    console.log(`-------------------------------------------`);
                    console.log(`Successfully synced ${bulkOps.length} products!`);
                }

                // fs.unlinkSync(importPath);
                // fs.unlinkSync(offersPath);

                return res.send("success");

            } else {
                console.log('Warning: Import triggered, but files are missing.');
                return res.send("success");
            }
        }

        return res.send("success");

    } catch (error) {
        console.error('❌ Error:', error);
        res.send("failure\n" + error.message);
    }
});

export default debugRouter;
