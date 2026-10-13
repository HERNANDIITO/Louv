import express from 'express';
import * as controller from './stats.controller.js';
import { authenticateAccessToken, isAdmin } from '../../middlewares/index.js';

const statsRouter = express.Router();

statsRouter.get(
    '/',
    controller.getStats
);

statsRouter.get(
    '/zip', 
    controller.getZipStats
);

statsRouter.get(
    '/users',
    controller.getUsersStats
);

statsRouter.get(
    '/users/:userId',
    controller.getUserStatsByUserId
);

statsRouter.get(
    '/materials',
    controller.getMaterialsStats
);

statsRouter.get(
    '/materials/:materialId',
    controller.getMaterialStatsByMaterialId
);

statsRouter.get(
    '/gemstones',
    controller.getGemstonesStats
);

statsRouter.get(
    '/gemstones/:gemstoneId',
    controller.getGemstoneStatsByGemstoneId
);

statsRouter.get(
    '/box',
    controller.getBoxesStats
);

statsRouter.get(
    '/jewels',
    controller.getJewelsStats
);

statsRouter.get(
    '/jewels/:jewelId',
    controller.getJewelStatsByJewelId
);

statsRouter.get(
    '/base-structures',
    controller.getBaseStructuresStats
);

statsRouter.get(
    '/base-structures/:baseStructureId',
    controller.getBaseStructureStatsByBaseStructureId
);

statsRouter.get(
    '/prices',
    controller.getPricesStats
);

statsRouter.get(
    '/orders',
    controller.getOrdersStats
);

// -------------------------------------------------------------------
// -   METALES Y GEMAS -----------------------------------------------
// -------------------------------------------------------------------

// DISTRIBUCIÓN PRESUPUESTO
statsRouter.get(
    '/budget-distribution',
    authenticateAccessToken,
    isAdmin,
    controller.getBudgetDistribution
);

// USO METALES
statsRouter.get(
    '/material-usage',
    authenticateAccessToken,
    isAdmin,
    controller.getMaterialUsage
);

// USO GEMAS Y CORTES
statsRouter.get(
    '/gem-cut-usage',
    authenticateAccessToken,
    isAdmin,
    controller.getGemCutUsage
);

// COMBINACIONES METAL GEMA
statsRouter.get(
    '/metal-gem-combinations',
    authenticateAccessToken,
    isAdmin,
    controller.getMetalGemCombinations
);

// -------------------------------------------------------------------
// -   BASES Y ENGASATES  --------------------------------------------
// -------------------------------------------------------------------

statsRouter.get(
    '/setting-usage',
    authenticateAccessToken,
    isAdmin,
    controller.getSettingUsage
);


statsRouter.get(
  '/size-usage',
  authenticateAccessToken,
  isAdmin,
  controller.getSizeUsage
);

statsRouter.get(
  '/base-setting-combinations',
  authenticateAccessToken,
  isAdmin,
  controller.getBaseSettingCombinations
);

statsRouter.get(
  '/base-usage',
  authenticateAccessToken,
  isAdmin,
  controller.getBaseUsage
);


// -------------------------------------------------------------------
// -   FACTURACIÓN  --------------------------------------------------
// -------------------------------------------------------------------

// ESTADÍSTICAS MES/AÑO (vendidos, ingresos, media precio)
statsRouter.get(
    "/year",
    authenticateAccessToken,
    isAdmin,
    controller.getYearlyOrdersStats
);

// ESTADÍSTICAS PRECIO MES/AÑO
statsRouter.get(
    "/yearly",
    authenticateAccessToken,
    isAdmin,
    controller.getYearlyDesignStats
);

// -------------------------------------------------------------------
// -   USUARIOS  -----------------------------------------------------
// -------------------------------------------------------------------

// UBICACIÓN, SEXO Y CANTIDAD USUARIOS REGISTRADOS
statsRouter.get(
    "/users-report", 
    authenticateAccessToken, 
    isAdmin,
    controller.getUserStats
);

// ESTADÍSTICAS DETALLADAS DE USUARIOS Y COMPORTAMIENTO
statsRouter.get(
    "/users-full",
    authenticateAccessToken, 
    isAdmin,
    controller.getYearlyUserFullStats
);

export default statsRouter;
