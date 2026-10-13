import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as StatsService from './stats.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats' });
};

export const getZipStats = (req, res) => {
    const filePath = path.join(process.cwd(), 'reports', 'report.zip');

    console.log('Intentando descargar ZIP en:', filePath);

    if (!fs.existsSync(filePath)) {
        console.error('El archivo no existe:', filePath);
        return res
            .status(404)
            .json({ message: 'El archivo de reporte no existe en el servidor.' });
    }

    return res.download(filePath, 'report.zip');
};

export const getUsersStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/users' });
};

export const getUserStatsByUserId = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/users/:userId' });
};

export const getMaterialsStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/materials' });
};

export const getMaterialStatsByMaterialId = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/materials/:materialId' });
};

export const getGemstonesStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/gemstones' });
};

export const getGemstoneStatsByGemstoneId = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/gemstones/:gemstoneId' });
};

export const getBoxesStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/box' });
};

export const getJewelsStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/jewels' });
};

export const getJewelStatsByJewelId = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/jewels/:jewelId' });
};

export const getBaseStructuresStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/base-structures' });
};

export const getBaseStructureStatsByBaseStructureId = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/base-structures/:baseStructureId' });
};

export const getPricesStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/prices' });
};

export const getOrdersStats = (req, res) => {
    res.json({ result: 'OK', endpoint: '/api/stats/orders' });
};

// -------------------------------------------------------------------
// -   METALES Y GEMAS -----------------------------------------------
// -------------------------------------------------------------------

// DISTRIBICIÓN PRESUPUESTO
export const getBudgetDistribution = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const budgetDistribution = await StatsService.getBudgetDistributionStats(year);
        res.status(200).json({ result: 'OK', budgetDistribution });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// USO METALES
export const getMaterialUsage = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const materialUsage = await StatsService.getMaterialUsageStats(year);
        res.status(200).json({ result: 'OK', materialUsage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// USO GEMAS Y CORTES
export const getGemCutUsage = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const gemCutUsage = await StatsService.getGemCutUsageStats(year);
        res.status(200).json({ result: 'OK', gemCutUsage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// COMBINACIONES METAL GEMA
export const getMetalGemCombinations = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const metalGemCombinations =
            await StatsService.getMetalGemCombinationsStats(year);
        res.status(200).json({ result: 'OK', metalGemCombinations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------------------------------------------------------
// -   BASES Y ENGASATES  --------------------------------------------
// -------------------------------------------------------------------

// USO ENGASTES
export const getSettingUsage = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const settingUsage = await StatsService.getSettingUsageStats(year);
        res.status(200).json({ result: 'OK', settingUsage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// USO TALLAS
export const getSizeUsage = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const sizeUsage = await StatsService.getSizeUsageStats(year);
        res.status(200).json({ result: 'OK', sizeUsage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// COMBINACIONES BASES Y ENGASTES
export const getBaseSettingCombinations = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const baseSettingCombinations =
            await StatsService.getBaseSettingCombinationsStats(year);
        res.status(200).json({ result: 'OK', baseSettingCombinations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// USO BASES
export const getBaseUsage = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;

        const baseUsage = await StatsService.getBaseUsageStats(year);
        res.status(200).json({ result: 'OK', baseUsage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------------------------------------------------------
// -   FACTURACIÓN  --------------------------------------------------
// -------------------------------------------------------------------

// ESTADÍSTICAS MES/AÑO (vendidos, ingresos, media precio)
export const getYearlyOrdersStats = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const data = await StatsService.getYearlyOrdersStats(year);

        res.status(200).json({
            result: 'OK',
            year,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ESTADÍSTICAS PRECIO MES/AÑO
export const getYearlyDesignStats = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const data = await StatsService.getYearlyDesignStats(year);

        res.status(200).json({
            result: 'OK',
            year,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------------------------------------------------------
// -   USUARIOS  -----------------------------------------------------
// -------------------------------------------------------------------

// UBICACIÓN, SEXO Y CANTIDAD USUARIOS REGISTRADOS
export const getUserStats = async (req, res) => {
    try {
        const data = await StatsService.getUserStats();
        res.status(200).json({
            result: 'OK',
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// stats.controller.js

export const getYearlyUserFullStats = async (req, res) => {
    try {
        // Obtenemos el año de la query o usamos el actual por defecto
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Llamamos al servicio (el que definimos en el paso anterior)
        const data = await StatsService.getFullUserStats(year);

        res.status(200).json({
            result: 'OK',
            year,
            data,
        });
    } catch (error) {
        console.error('Error en getYearlyUserFullStats:', error);
        res.status(500).json({
            result: 'ERROR',
            error: error.message,
        });
    }
};
