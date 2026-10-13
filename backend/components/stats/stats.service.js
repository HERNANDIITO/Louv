import * as StatsRepository from './stats.repository.js';

// -------------------------------------------------------------------
// -   METALES Y GEMAS -----------------------------------------------
// -------------------------------------------------------------------

// DISTRIBUCIÓN PRESUPUESTO
const buildBudgetDist = ({ metalTotal = 0, gemstonesTotal = 0 } = {}) => {
    const total = metalTotal + gemstonesTotal;

    if (total === 0) {
        return [
            { name: 'Metales', percentage: 0 },
            { name: 'Gemas', percentage: 0 },
        ];
    }

    return [
        {
            name: 'Metales',
            percentage: Math.round((metalTotal / total) * 100),
        },
        {
            name: 'Gemas',
            percentage: Math.round((gemstonesTotal / total) * 100),
        },
    ];
};

export const getBudgetDistributionStats = async (year = null) => {
    const [designedResults, boughtResults] = await Promise.all([
        StatsRepository.getDesignedBudgetDistribution(year),
        StatsRepository.getBoughtBudgetDistribution(year),
    ]);

    const designed = designedResults[0] ?? {};
    const bought = boughtResults[0] ?? {};

    return {
        designed: {
            budgetDist: buildBudgetDist(designed),
        },
        bought: {
            budgetDist: buildBudgetDist(bought),
        },
    };
};

// USO METALES
const buildMaterialUsage = (rows = []) => {
    const result = {};

    for (const row of rows) {
        const material = row._id.material;
        const purity = row._id.purity;
        const count = row.count;

        if (!result[material]) {
            result[material] = { material };
        }

        if (purity === '9K') result[material].k9 = count;
        if (purity === '14K') result[material].k14 = count;
        if (purity === '18K') result[material].k18 = count;
        if (purity === 'Pt950') result[material].pt950 = count;
    }

    return Object.values(result);
};

export const getMaterialUsageStats = async (year = null) => {
    const [designedRows, boughtRows] = await Promise.all([
        StatsRepository.getDesignedMaterialUsage(year),
        StatsRepository.getBoughtMaterialUsage(year),
    ]);

    return {
        designed: buildMaterialUsage(designedRows),
        bought: buildMaterialUsage(boughtRows),
    };
};

// USO GEMAS Y CORTES
export const getGemCutUsageStats = async (year = null) => {
    const [designed, bought] = await Promise.all([
        StatsRepository.getDesignedGemCutUsage(year),
        StatsRepository.getBoughtGemCutUsage(year),
    ]);

    return {
        designed,
        bought,
    };
};

// COMBINACIONES METAL GEMA
const buildMetalGemCombinations = (rows = []) => {
    const total = rows.reduce((sum, row) => sum + row.count, 0);

    return rows
        .slice(0, 5)
        .map((row) => ({
            metal: `${row._id.metal} ${row._id.purity}`,
            gem: row._id.gem,
            percentage: total > 0
                ? Math.round((row.count / total) * 100)
                : 0,
            metalIcon: row._id.metalIcon,
            gemIcon: row._id.gemIcon,
        }));
};

export const getMetalGemCombinationsStats = async (year = null) => {
    const [designedRows, boughtRows] = await Promise.all([
        StatsRepository.getDesignedMetalGemCombinations(year),
        StatsRepository.getBoughtMetalGemCombinations(year),
    ]);

    return {
        designed: buildMetalGemCombinations(designedRows),
        bought: buildMetalGemCombinations(boughtRows),
    };
};

// -------------------------------------------------------------------
// -   BASES Y ENGASATES  --------------------------------------------
// -------------------------------------------------------------------

// USO ENGASTES
const formatSettingName = (name) => {
    const map = {
        'Prong diagonal': 'Prong D.'
    };

    return map[name] ?? name;
};

const buildUsageItems = (rows = []) => {
    const total = rows.reduce((sum, row) => sum + row.quantity, 0);

    return rows.map(row => {
        const parts = [
        formatSettingName(row._id.setting),
        row._id.clawNumber,
        row._id.clawType,
    ].filter(Boolean);

    return {
        name: parts.join('\n'),
        percentage: total > 0 ? Math.round((row.quantity / total) * 100) : 0,
        quantity: row.quantity,
    };
    });
};

export const getSettingUsageStats = async (year = null) => {
    const [designedRows, boughtRows] = await Promise.all([
        StatsRepository.getDesignedSettingUsage(year),
        StatsRepository.getBoughtSettingUsage(year),
    ]);

    return {
        designed: buildUsageItems(designedRows),
        bought: buildUsageItems(boughtRows),
    };
};

// USO TALLAS
const buildUsageItemsSize = (rows = []) => {
    const total = rows.reduce((sum, row) => sum + row.quantity, 0);

    return rows.map(row => ({
        name: row._id,
        percentage: total > 0 ? Math.round((row.quantity / total) * 100) : 0,
        quantity: row.quantity,
    }));
};

export const getSizeUsageStats = async (year = null) => {
    const [designedRows, boughtRows] = await Promise.all([
        StatsRepository.getDesignedSizeUsage(year),
        StatsRepository.getBoughtSizeUsage(year),
    ]);

    return {
        designed: buildUsageItemsSize(designedRows),
        bought: buildUsageItemsSize(boughtRows),
    };
};

// COMBINACIONES BASES Y ENGASTES 
const buildBaseSettingCombinations = (rows = []) => {
    const total = rows.reduce((sum, row) => sum + row.quantity, 0);

    return rows.slice(0, 5).map((row) => {
        const baseParts = [
        row._id.baseStructure,
        row._id.profile,
        row._id.variant,
        ].filter(Boolean);

        const settingParts = [
        formatSettingName(row._id.setting),
        row._id.clawNumber,
        row._id.clawType,
        ].filter(Boolean);

        return {
        base: baseParts.join(' '),
        setting: settingParts.join(' '),
        percentage: total > 0 ? Math.round((row.quantity / total) * 100) : 0,
        baseIcon: row._id.baseIcon,
        settingIcon: row._id.settingIcon,
        };
    });
};

export const getBaseSettingCombinationsStats = async (year = null) => {
    const [designedRows, boughtRows] = await Promise.all([
        StatsRepository.getDesignedBaseSettingCombinations(year),
        StatsRepository.getBoughtBaseSettingCombinations(year),
    ]);

    return {
        designed: buildBaseSettingCombinations(designedRows),
        bought: buildBaseSettingCombinations(boughtRows),
    };
};

// USO BASES
const buildDonutItems = (items = []) => {
  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  return items
    .sort((a, b) => b.quantity - a.quantity)
    .map((item) => ({
      name: item.name,
      percentage: total > 0 ? Math.round((item.quantity / total) * 100) : 0,
      quantity: item.quantity,
      image: item.image,
    }));
};

const buildBaseUsage = (rows = []) => {
  const globalTotal = rows.reduce((sum, row) => sum + row.quantity, 0);

  const baseMap = new Map();

  for (const row of rows) {
    const baseId = row._id.baseId.toString();

    if (!baseMap.has(baseId)) {
      baseMap.set(baseId, {
        name: row._id.baseName,
        quantity: 0,
        profiles: new Map(),
        styles: new Map(),
      });
    }

    const base = baseMap.get(baseId);
    base.quantity += row.quantity;

    const profileKey = row._id.profileId?.toString() ?? row._id.profileName;
    if (profileKey) {
      const current = base.profiles.get(profileKey) ?? {
        name: row._id.profileName,
        image: row._id.profileImage,
        quantity: 0,
      };

      current.quantity += row.quantity;
      base.profiles.set(profileKey, current);
    }

    const styleKey = row._id.variantName;
    if (styleKey) {
      const current = base.styles.get(styleKey) ?? {
        name: row._id.variantName,
        image: row._id.variantImage,
        quantity: 0,
      };

      current.quantity += row.quantity;
      base.styles.set(styleKey, current);
    }
  }

  return Array.from(baseMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .map((base) => ({
      name: base.name,
      percentage:
        globalTotal > 0 ? Math.round((base.quantity / globalTotal) * 100) : 0,
      quantity: base.quantity,
      profile: buildDonutItems(Array.from(base.profiles.values())),
      style: buildDonutItems(Array.from(base.styles.values())),
    }));
};

export const getBaseUsageStats = async (year = null) => {
    const [designedRows, boughtRows] = await Promise.all([
        StatsRepository.getDesignedBaseUsage(year),
        StatsRepository.getBoughtBaseUsage(year),
    ]);

    return {
        designed: buildBaseUsage(designedRows),
        bought: buildBaseUsage(boughtRows),
    };
};


// -------------------------------------------------------------------
// -   FACTURACIÓN  --------------------------------------------------
// -------------------------------------------------------------------

// ESTADÍSTICAS MES/AÑO (vendidos, ingresos, media precio)
export const getYearlyOrdersStats = async (year) => {
    const result = await StatsRepository.getYearlyOrdersStats(year);
    

    const meses = new Array(12).fill(null).map(() => ({
        totalProductos: 0,
        ingresosTotales: 0,
        precioMedio: 0
    }));

    result.forEach(r => {
        meses[r._id - 1] = {
            totalProductos: r.totalProductos,
            ingresosTotales: r.ingresosTotales,
            precioMedio: r.precioMedio
        };
    });

    return meses;
};

// ESTADÍSTICAS PRECIO MES/AÑO
export const getYearlyDesignStats = async (year) => {

    const result = await StatsRepository.getYearlyDesignStats(year);

    const meses = new Array(12).fill(0);

    result.forEach(r => {
        meses[r._id - 1] = r.precioMedio;
    });

    return meses;
};

// -------------------------------------------------------------------
// -   USUARIOS  -----------------------------------------------------
// -------------------------------------------------------------------

// UBICACIÓN, SEXO Y CANTIDAD USUARIOS REGISTRADOS
export const getUserStats = async () => {
    const rawResult = await StatsRepository.getUserStats();
    
    const result = (rawResult && rawResult[0]) ? rawResult[0] : null;

    if (!result) {
        return { totalRegistrados: 0, provincias: [], sexo: [], evolucionMensual: [] };
    }

    const totalCount = (result.totalUsuarios && result.totalUsuarios[0]) 
        ? result.totalUsuarios[0].count 
        : 0;

    const mesesLabels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        mesesLabels.push({
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            total: 0
        });
    }

    if (result.registrosMensuales) {
        result.registrosMensuales.forEach(r => {
            const index = mesesLabels.findIndex(m => m.year === r._id.year && m.month === r._id.month);
            if (index !== -1) mesesLabels[index].total = r.total;
        });
    }

    const statsSexo = result.porSexo.map(s => {
        let etiqueta = "Desconocido";
        if (s._id === "Mr.") etiqueta = "Hombres";
        if (s._id === "Ms.") etiqueta = "Mujeres";
        return { etiqueta, total: s.total };
    });

    const statsProvincias = result.porProvincia.map(p => ({
        _id: p._id || "Otras", 
        total: p.total
    }));

    return {
        totalRegistrados: totalCount,
        provincias: statsProvincias,
        sexo: statsSexo,
        evolucionMensual: mesesLabels
    };
};

// Función unificada
export const getFullUserStats = async (year) => {
    const [metrics, designData, buyers] = await Promise.all([
        StatsRepository.getMonthlyUserMetrics(year),
        StatsRepository.getAverageDesignTime(year),
        StatsRepository.getBuyerStats(year)
    ]);

    const meses = new Array(12).fill(null).map(() => ({
        visits: 0,
        activeUsers: 0,
        logins: 0,
        signups: 0,
        editorAccesses: 0,
        returningUsers: 0,
        avgDesignTime: 0,
        finishedDesigns: 0,
        totalBuyers: 0,
        totalRecurrent: 0,
        sources: {
            google: 0, instagram: 0, tiktok: 0,
            facebook: 0, wordpress: 0, direct: 0
        }
    }));

   
    metrics.forEach(m => {
        const monthIndex = parseInt(m.monthKey.split('-')[1]) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            meses[monthIndex] = {
                ...meses[monthIndex],
                ...m,
                sources: m.sources || meses[monthIndex].sources
            };
        }
    });

    designData.forEach(d => {
        const idx = d._id - 1;
        meses[idx].avgDesignTime = d.avgTime || 0;
        meses[idx].finishedDesigns = d.totalFinishedDesigns || 0; 
    });

    buyers.forEach(b => {
        meses[b._id - 1].totalBuyers = b.totalBuyers || 0;
        meses[b._id - 1].totalRecurrent = b.totalRecurrent || 0;
    });

    return meses;
};