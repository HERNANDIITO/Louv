import createError from 'http-errors';
import Decimal from 'decimal.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

import * as JewelRepository from './jewels.repository.js';

import * as MaterialService from '../materials/materials.service.js';
import * as BaseStructureService from '../baseStructures/baseStructures.service.js';
import * as SettingService from '../settings/settings.service.js';
import * as GemstoneService from '../gemstones/gemstones.service.js';
import * as CutService from '../cuts/cut.service.js';

/* -------------------------------------------------------------------------- */
/*                                CONSTANTES                                  */
/* -------------------------------------------------------------------------- */

const ZERO = new Decimal(0);
const TAX_RATE = new Decimal(1.21);

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const saveSnapshot = (base64String, fileName) => {
    // // Si no es un base64 (es una URL o está vacío), no hacemos nad
    const publicPath = path.join(process.cwd(), 'public', 'captures');
    const filePath = path.join(publicPath, fileName);

    // Si recibimos una imagen
    if (base64String && base64String.startsWith('data:image')) {
        try {
            const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFileSync(filePath, base64Data, 'base64');
            return fileName;
        } catch (error) {
            return null;
        }
    }

    // CSi NO hay foto, creamos la copia por defecto
    try {
        const defaultImagePath = path.join(publicPath, 'default.png');
        
        // Verificar si el archivo de destino ya existe para no sobrescribir innecesariamente
        if (!fs.existsSync(filePath)) {
            if (fs.existsSync(defaultImagePath)) {
                fs.copyFileSync(defaultImagePath, filePath);
            } else {
                return null;
            }
        }
        return fileName;
    } catch (error) {
        return null;
    }
};

const deleteJewelImage = (snapshotName) => {
    if (!snapshotName) return;
    // Eliminamos 'captures/' si el string lo incluye por error
    const fileName = snapshotName.replace('captures/', '');
    const filePath = path.join(process.cwd(), 'public', 'captures', fileName);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {}
    }
};

async function buildContext(jewelData) {
    const baseStructure = await BaseStructureService.findBaseStructureById({
        baseStructureId: jewelData.composition.baseStructure,
    });

    if (!baseStructure) throw createError.NotFound('Estructura base no encontrada');

    // Buscamos el perfil con una comparación más robusta
    const profile = baseStructure.profiles.find((p) => {
        // Probamos p.profile (si es ID) o p.profile._id (si está poblado)
        const pId = p.profile?._id || p.profile;
        return String(pId) === String(jewelData.composition.profile);
    });

    if (!profile) {
        throw createError.NotFound('Perfil no encontrado');
    }

    const variant = profile.variants.find((v) => 
        String(v._id) === String(jewelData.composition.variant)
    );

    if (!variant) throw createError.NotFound('La variante seleccionada no existe en este perfil');

    const material = await MaterialService.findMaterialById({
        materialId: jewelData.composition.material,
    });

    if (!material) throw createError.NotFound('Material no encontrado');

    const purity = material.purities.find((p) =>
        String(p._id) === String(jewelData.composition.materialPurity)
    );

    if (!purity) throw createError.NotFound('La pureza seleccionada no existe para este material');

    return {
        baseStructure,
        profile,
        variant,
        volume: profile.volume || 0, 
        extraPrice: variant.extraPrice || 0,
        materialPricePermm3: purity.pricePermm3,
    };
}

/* -------------------------------------------------------------------------- */
/*                          CÁLCULOS DE PRECIO                                */
/* -------------------------------------------------------------------------- */

export const getJewelPriceQuote = async ({ jewelData }) => {
    // Reutilizamos la lógica de cálculoç
    const prices = await calculatePrices(jewelData);
    
    return {
        ...prices
    };
};

function calcBaseStructurePrice(ctx) {
    return new Decimal(ctx.volume.toString())
        .mul(ctx.materialPricePermm3.toString())
        .plus(ctx.extraPrice.toString());
}

async function calcSettingsPrice(jewelData, ctx) {
    let total = ZERO;
    let priceList = [];

    // Obtenemos el tamaño seleccionado (del array de la composición)
    const globalSettingsSize = jewelData.composition.settingsSize[0];

    for (let i = 0; i < jewelData.composition.settings.length; i++) {
        const setting = jewelData.composition.settings[i];

        const settingDoc = await SettingService.findSettingById({
            settingId: setting.setting,
        });
        const clawNumber = settingDoc.clawNumber.find((c) =>
            c._id.equals(setting.clawNumber)
        );
        const compatibleCut = clawNumber.compatibleCuts.find((c) =>
            c.cut.equals(setting.gemstoneCut)
        );
        const clawType = compatibleCut.clawType.find((c) =>
            c._id.equals(setting.clawType)
        );

        let settingScale = getParentScale(ctx, setting, i, globalSettingsSize);

        const price = new Decimal(clawType.volume.toString())
        .mul(Math.pow(settingScale, 3).toString())
        .mul(ctx.materialPricePermm3.toString())
        .plus(clawType.extraPrice.toString());
        
        const existingSetting = priceList.find(item => item.name == `${settingDoc.name}, ${clawNumber.name}, ${clawType.name}` && item.scale == settingScale);
        if (existingSetting) {
            existingSetting.quantity++;
            existingSetting.price = existingSetting.price.plus(price);
        } else {
            priceList.push({ name: `${settingDoc.name}, ${clawNumber.name}, ${clawType.name}`, price: price, quantity: 1, scale: settingScale });
        }

        total = total.plus(price);
    }

    return {total, priceList};
}

function getParentScale(ctx, setting, index, globalSettingsSize) {
    const settingInfo = ctx.variant.settingsInfo.find((s) => s.gemPosId === index + 1);
    
    if (!settingInfo) {
        return 1;
    }

    const compatibleSetting = settingInfo.compatibleSettings.find((s) =>
        String(s.setting) === String(setting.setting)
    );
    
    if (!compatibleSetting) {
        return 1;
    }

    const scaleObj = compatibleSetting.scalePerSettingSize.find(
        (s) => String(s.size) === String(globalSettingsSize)
    );

    if (!scaleObj) {
        return 1;
    }

    // Convertir el Decimal128 de Mongoose a un Number de JS
    const scaleValue = parseFloat(scaleObj.scale.toString());
    
    return scaleValue;
}

function findQuality(gemstone, scale) {
    return gemstone.qualities.find(
        (q) => scale >= q.minScaleFactor && scale <= q.maxScaleFactor
    );
}

function calcGemCarats(scale, quality) {
    const minScaleFactor = quality.minScaleFactor;
    const maxScaleFactor = quality.maxScaleFactor;
    const caratRangeMin = quality.caratRangeMin;
    const caratRangeMax = quality.caratRangeMax;

    // Interpolación cúbica -> volumen | escala 3
    const t =
        (Math.pow(scale, 3) - Math.pow(minScaleFactor, 3)) /
        (Math.pow(maxScaleFactor, 3) - Math.pow(minScaleFactor, 3));

    const carats = caratRangeMin + t * (caratRangeMax - caratRangeMin);

    return carats >= 0.02 ? carats.toFixed(2) : Math.max(carats.toFixed(3), 0.005);
}

function calcGemPrice(scale, quality, isSynthetic) {
    const price = isSynthetic
        ? quality.pricePerCaratSynthetic
        : quality.pricePerCaratNatural;
    // return new Decimal(scale.toString()).mul(price.toString());
    return new Decimal(price.toString());
}

async function calcAccentGemstones(setting, clawType, parentScale, cuts) {
    let total = ZERO;
    let priceList = [];

    if (!setting.pattern || setting.pattern.length === 0) return ZERO;

    for (const p of setting.pattern) {
        const patternConfig = clawType.availablePatterns.find(
            (ap) => String(ap._id) === String(p.pattern)
        );

        if (!patternConfig) continue;

        for (let i = 0; i < p.gemstone.length; i++) {
            const gemstoneId = p.gemstone[i];
            const isSynthetic = p.isSynthetic[i];

            const gem = await GemstoneService.findGemstoneById({
                gemstoneId: gemstoneId,
            });

            if (!gem) continue;

            // Buscamos el factor de escala específico para esta gema dentro del patrón
            // Si el modelo tiene un array de gemstones, lo ideal es usar el índice [i]
            const childScaleFactor = patternConfig.gemstones[i]?.scaleFactor || 
                                     patternConfig.gemstones[0]?.scaleFactor || 1;
                                     
            const scale = new Decimal(parentScale.toString()).mul(childScaleFactor.toString());
            const name = gem.name;
            const origin = setting.isSynthetic
                ? (gem.name.endsWith("a") ? "creada" : "creado")
                : "natural";

            const cut = cuts.find(cut => 
                cut._id == setting.gemstoneCut
            );
            let cutName = cut.name.toLowerCase();

            const quality = findQuality(gem, scale.toNumber());
            if (quality) {
                const carats = calcGemCarats(scale, quality);
                const price = calcGemPrice(scale, quality, isSynthetic);
                total = total.plus(price);

                const existingGem = priceList.find(item => 
                    item.name == name && 
                    item.carats == carats && 
                    item.origin == origin &&
                    item.cut == cutName
                );
                if (existingGem) {
                    existingGem.quantity++;
                    existingGem.price = existingGem.price.plus(price);
                } else {
                    priceList.push({ 
                        name: name, 
                        price: price, 
                        carats: carats, 
                        quantity: 1, 
                        origin: origin,
                        cut: cutName
                    });
                }
            }            
        }
    }

    return {total, priceList};
}

async function calcGemstonesPrice(jewelData, ctx) {
    let total = ZERO;
    let priceList = [];
    const cuts = await CutService.findCuts({}); 
    
    // Obtenemos el tamaño seleccionado (del array de la composición)
    const globalSettingsSize = jewelData.composition.settingsSize[0];

    for (let i = 0; i < jewelData.composition.settings.length; i++) {
        const setting = jewelData.composition.settings[i];

        const settingDoc = await SettingService.findSettingById({
            settingId: setting.setting,
        });
        const clawNumber = settingDoc.clawNumber.find((c) =>
            c._id.equals(setting.clawNumber)
        );
        const compatibleCut = clawNumber.compatibleCuts.find((c) =>
            c.cut.equals(setting.gemstoneCut)
        );
        const clawType = compatibleCut.clawType.find((c) =>
            c._id.equals(setting.clawType)
        );

        const gemstone = await GemstoneService.findGemstoneById({
            gemstoneId: setting.gemstone,
        });

        const parentScale = getParentScale(ctx, setting, i, globalSettingsSize);
        const quality = findQuality(gemstone, parentScale);
        
        const cut = cuts.find(cut => 
            cut._id == setting.gemstoneCut
        );
        let cutName = cut.name.toLowerCase();

        if (quality) {
            const mainGemPrice = calcGemPrice(parentScale, quality, setting.isSynthetic);
            const mainGemCarats = calcGemCarats(parentScale, quality);
            
            const origin = setting.isSynthetic
                ? (gemstone.name.endsWith("a") ? "creada" : "creado")
                : "natural";

            const existingGem = priceList.find(item => 
                item.name == gemstone.name && 
                item.carats == mainGemCarats && 
                item.origin == origin && 
                item.cut == cutName);
            if (existingGem) {
                existingGem.quantity++;
                existingGem.price = existingGem.price.plus(mainGemPrice);
            } else {
                priceList.push({ 
                    name: gemstone.name,
                    price: mainGemPrice,
                    carats: mainGemCarats,
                    quantity: 1,
                    origin: origin,
                    cut: cutName
                });
            }

            total = total.plus(mainGemPrice);
        }
        
        const accentGemsPrice = await calcAccentGemstones(setting, clawType, parentScale, cuts);
        if (accentGemsPrice.priceList) {
            for (const gem of accentGemsPrice.priceList) {
            
                priceList.push({
                    name: gem.name,
                    price: gem.price,
                    carats: gem.carats,
                    quantity: gem.quantity,
                    origin: gem.origin,
                    cut: gem.cut
                });
            }

            total = total.plus(accentGemsPrice.total);
        }
    }

    return {total, priceList};
}

async function calculatePrices(jewelData) {
    
    const ctx = await buildContext(jewelData);

    const basePrice = calcBaseStructurePrice(ctx);
    const settingsPrice = await calcSettingsPrice(jewelData, ctx);
    const gemsPrice = await calcGemstonesPrice(jewelData, ctx);

    const metalPrice = basePrice.plus(settingsPrice.total);
    
    const currentPrice = basePrice.plus(settingsPrice.total).plus(gemsPrice.total);
    const taxablePrice = currentPrice.mul(TAX_RATE);

    const taxes = taxablePrice - currentPrice;

    return { metalPrice, currentPrice, taxablePrice, basePrice, settingsPrice, gemsPrice, taxes };

}

const normalizeJewelData = async ({ existingJewel, jewelUpdateData }) => {
    if (!jewelUpdateData || !jewelUpdateData.composition) {
        return jewelUpdateData;
    }

    const prices = await calculatePrices(jewelUpdateData); 

    const extraTime = Number(jewelUpdateData.additionalTime) || 0;

    const jewelId = existingJewel ? existingJewel._id : (jewelUpdateData._id || new mongoose.Types.ObjectId());
    
    if (!existingJewel) jewelUpdateData._id = jewelId;
    
    const standardName = `anillo_${jewelId}.png`;
    
    // El path por defecto será el que ya tenía o el nombre estándar nuevo
    let finalSnapshotPath = existingJewel?.snapshot || standardName;

    // Solo entramos aquí si el frontend envía un Base64 nuevo (data:image...)
    if (jewelUpdateData.snapshot && jewelUpdateData.snapshot.startsWith('data:image')) {
        
        // Si ya tenía una foto pero se llamaba diferente, la borramos
        if (existingJewel?.snapshot && existingJewel.snapshot !== standardName) {
            deleteJewelImage(existingJewel.snapshot);
        }

        // Guardamos con el nombre estándar. Si ya existía uno con ese nombre, se sobrescribe.
        const savedPath = saveSnapshot(jewelUpdateData.snapshot, standardName);
        if (savedPath) finalSnapshotPath = savedPath;
    }

    const taxableHistory = existingJewel
        ? [...(existingJewel.taxableHistory || []), prices.taxablePrice]
        : [prices.taxablePrice];

    const priceHistory = existingJewel
        ? [...(existingJewel.priceHistory || []), prices.currentPrice]
        : [prices.currentPrice];

    return {
        ...jewelUpdateData, 
        lastEdition: new Date(),
        timesEdited: existingJewel ? existingJewel.timesEdited + 1 : 1,
        timeSpent: existingJewel ? (existingJewel.timeSpent + extraTime) : extraTime,
        metalPrice: prices.metalPrice,
        gemstonesPrice: prices.gemsPrice.total,
        taxablePrice: prices.taxablePrice,
        currentPrice: prices.currentPrice,
        taxableHistory,
        priceHistory,
        snapshot: finalSnapshotPath 
    };
};

const requireJewel = async (jewelPromise) => {
    const jewel = await jewelPromise;
    if (!jewel) {
        throw createError.NotFound('Joya no encontrada.');
    }
    return jewel;
};

/* -------------------------------------------------------------------------- */
/*                         INTERNAL / SHARED FUNCTIONS                        */
/* -------------------------------------------------------------------------- */

export const findOwnedJewels = async ({ userId }) => {
    return JewelRepository.findMany({ user: userId });
};

export const findOwnedJewelById = async ({ userId, jewelId }) => {
    return requireJewel(JewelRepository.findOne({ _id: jewelId, user: userId }));
};


export const updateOwnJewelById = async ({ userId, jewelId, jewelUpdateData }) => {
    const existingJewel = await findOwnedJewelById({ userId, jewelId });
    const normalizedData = await normalizeJewelData({ existingJewel, jewelUpdateData });
    return JewelRepository.updateOne({ _id: jewelId }, normalizedData);
};

export const deleteOwnJewelById = async ({ jewelId, userId }) => {
    const jewel = await findOwnedJewelById({ userId, jewelId });
    deleteJewelImage(jewel.snapshot);
    return requireJewel(JewelRepository.deleteOne({ _id: jewelId, user: userId }));
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findJewels = async () => {
    return JewelRepository.findMany();
};

export const findSharedJewels = async () => {
    return JewelRepository.findMany({
        filter: {
            $nor: [
                { shareHashWithPrice: { $exists: false } },
                { shareHashWithPrice: null },
                { shareHashWithoutPrice: { $exists: false } },
                { shareHashWithoutPrice: null },
            ],
        },
    });
};

export const findJewelById = async ({ jewelId }) => {
    return requireJewel(JewelRepository.findOne({ _id: jewelId }));
};

export const findJewelByHash = async ( hash ) => {
    const jewel = await requireJewel(
        JewelRepository.findOne({
            $or: [{ shareHashWithPrice: hash }, { shareHashWithoutPrice: hash }],
        })
    );
    
    delete jewel.taxableHistory;
    delete jewel.priceHistory;
    delete jewel.currentPrice;
    
    if (jewel.shareHashWithoutPrice === hash) {
        delete jewel.taxablePrice;
    }

    return jewel;
};

export const createJewel = async ({ userId, jewelData }) => {
    const normalizedData = await normalizeJewelData({ existingJewel: null, jewelUpdateData: jewelData });
    normalizedData.user = userId;

    // Primero conseguir un id
    const newJewel = await JewelRepository.createOne(normalizedData);
    
    // Generamos el archivo físico de la foto
    const finalFileName = `anillo_${newJewel._id}.png`;
    
    const result = saveSnapshot(jewelData.snapshot, finalFileName);
    
    if (result) {
        await JewelRepository.updateOne({ _id: newJewel._id }, { snapshot: finalFileName });
        newJewel.snapshot = finalFileName;
    }
    
    return newJewel;
};

export const updateJewelById = async ({ jewelId, jewelUpdateData }) => {
    return requireJewel(JewelRepository.updateOne({ _id: jewelId }, jewelUpdateData));
};

export const deleteJewelById = async ({ jewelId }) => {
    const jewel = await findJewelById({ jewelId });
    deleteJewelImage(jewel.snapshot);
    return requireJewel(JewelRepository.deleteOne({ _id: jewelId }));
};
