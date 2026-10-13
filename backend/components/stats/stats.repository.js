import Jewelry from '../../db-schemas/jewelry.schema.js';
import Order from '../../db-schemas/order.schema.js';
import User from '../../db-schemas/user.schema.js';
import MonthlyStat from '../../db-schemas/monthly-stat.schema.js';

const toNumberDecimal = (field) => ({
    $convert: {
        input: field,
        to: 'double',
        onError: 0,
        onNull: 0,
    },
});

const buildYearMatch = (year, field) => {
  if (!year) return {};

  return {
    [field]: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
    },
  };
};

// -------------------------------------------------------------------
// -   METALES Y GEMAS -----------------------------------------------
// -------------------------------------------------------------------

// DISTRIBUCIÓN PRESUPUESTO
export const getDesignedBudgetDistribution = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),
        {
            $group: {
                _id: null,
                metalTotal: { $sum: toNumberDecimal('$metalPrice') },
                gemstonesTotal: { $sum: toNumberDecimal('$gemstonesPrice') },
            },
        },
    ]);
};

export const getBoughtBudgetDistribution = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');
    
  return Order.aggregate([
        {
            $match: {
                state: { $in: ['ordered', 'delivered'] },
                ...yearMatch
            },
        },
        {
            $unwind: '$products',
        },
        {
            $group: {
                _id: null,
                metalTotal: { $sum: toNumberDecimal('$products.metalPrice') },
                gemstonesTotal: { $sum: toNumberDecimal('$products.gemstonesPrice') },
            },
        },
    ]);
};

// USO METALES
export const getDesignedMaterialUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),

    {
        $lookup: {
            from: 'materials',
            localField: 'composition.material',
            foreignField: '_id',
            as: 'material',
        },
    },
    { $unwind: '$material' },
    { $unwind: '$material.purities' },
    {
      $match: {
        $expr: {
          $eq: ['$material.purities._id', '$composition.materialPurity'],
        },
      },
    },
    {
      $group: {
        _id: {
            material: '$material.name',
            purity: '$material.purities.purity',
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

export const getBoughtMaterialUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');

  return Order.aggregate([
    {
        $match: {
            state: { $in: ['ordered', 'delivered'] },
            ...yearMatch,
        },
    },
    { $unwind: '$products' },
    {
        $lookup: {
            from: 'materials',
            localField: 'products.composition.material',
            foreignField: '_id',
            as: 'material',
        },
    },
    { $unwind: '$material' },
    { $unwind: '$material.purities' },
    {
        $match: {
            $expr: {
            $eq: ['$material.purities._id', '$products.composition.materialPurity'],
            },
        },
    },
    {
      $group: {
        _id: {
            material: '$material.name',
            purity: '$material.purities.purity',
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

// USO GEMAS Y CORTES
export const getDesignedGemCutUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),

        { $unwind: '$composition.settings' },

        {
            $match: {
                'composition.settings.gemstone': { $ne: null },
                'composition.settings.gemstoneCut': { $ne: null },
            },
        },

        {
            $lookup: {
                from: 'gemstones',
                localField: 'composition.settings.gemstone',
                foreignField: '_id',
                as: 'gemstone',
            },
        },
        { $unwind: '$gemstone' },

        {
            $match: {
                'gemstone.name': { $ne: 'None'},
            },
        },

        {
            $lookup: {
                from: 'cuts',
                localField: 'composition.settings.gemstoneCut',
                foreignField: '_id',
                as: 'cut',
            },
        },
        { $unwind: '$cut' },

        {
            $group: {
                _id: {
                    gem: '$gemstone.name',
                    cut: '$cut.name',
                },
                value: { $sum: 1 },
            },
        },

        {
            $project: {
                _id: 0,
                gem: '$_id.gem',
                cut: '$_id.cut',
                value: 1,
            },
        },

        {
            $sort: {
                gem: 1,
                value: -1,
            },
        },
    ]);
};

export const getBoughtGemCutUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');
    
  return Order.aggregate([
        {
            $match: {
                state: { $in: ['ordered', 'delivered'] },
                ...yearMatch
            },
        },

        { $unwind: '$products' },
        { $unwind: '$products.composition.settings' },

        {
            $match: {
                'products.composition.settings.gemstone': { $ne: null },
                'products.composition.settings.gemstoneCut': { $ne: null },
            },
        },

        {
            $lookup: {
                from: 'gemstones',
                localField: 'products.composition.settings.gemstone',
                foreignField: '_id',
                as: 'gemstone',
            },
        },
        { $unwind: '$gemstone' },

        {
            $match: {
                'gemstone.name': { $ne: 'None' },
            }
        },

        {
            $lookup: {
                from: 'cuts',
                localField: 'products.composition.settings.gemstoneCut',
                foreignField: '_id',
                as: 'cut',
            },
        },
        { $unwind: '$cut' },

        {
            $group: {
                _id: {
                    gem: '$gemstone.name',
                    cut: '$cut.name',
                },
                value: { $sum: 1 },
            },
        },

        {
            $project: {
                _id: 0,
                gem: '$_id.gem',
                cut: '$_id.cut',
                value: 1,
            },
        },

        {
            $sort: {
                gem: 1,
                value: -1,
            },
        },
    ]);
};

// COMBINACIONES METAL GEMA
export const getDesignedMetalGemCombinations = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),

        { $unwind: '$composition.settings' },

        {
            $match: {
                'composition.settings.gemstone': { $ne: null },
            },
        },

        {
            $lookup: {
                from: 'materials',
                localField: 'composition.material',
                foreignField: '_id',
                as: 'material',
            },
        },
        { $unwind: '$material' },
        { $unwind: '$material.purities' },

        {
            $match: {
                $expr: {
                    $eq: ['$material.purities._id', '$composition.materialPurity'],
                },
            },
        },

        {
            $lookup: {
                from: 'gemstones',
                localField: 'composition.settings.gemstone',
                foreignField: '_id',
                as: 'gemstone',
            },
        },
        { $unwind: '$gemstone' },

        {
            $match: {
                'gemstone.name': { $ne: 'None'},
            },
        },

        {
            $group: {
                _id: {
                    metal: '$material.name',
                    purity: '$material.purities.purity',
                    metalIcon: '$material.purities.class',
                    gem: '$gemstone.name',
                    gemIcon: '$gemstone.image',
                },
                count: { $sum: 1 },
            },
        },

        { $sort: { count: -1 } },
    ]);
};

export const getBoughtMetalGemCombinations = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');

    return Order.aggregate([
        {
            $match: {
                state: { $in: ['ordered', 'delivered'] },
                ...yearMatch
            },
        },

        { $unwind: '$products' },
        { $unwind: '$products.composition.settings' },

        {
            $match: {
                'products.composition.settings.gemstone': { $ne: null },
            },
        },

        {
            $lookup: {
                from: 'materials',
                localField: 'products.composition.material',
                foreignField: '_id',
                as: 'material',
            },
        },
        { $unwind: '$material' },
        { $unwind: '$material.purities' },

        {
            $match: {
                $expr: {
                    $eq: ['$material.purities._id', '$products.composition.materialPurity'],
                },
            },
        },

        {
            $lookup: {
                from: 'gemstones',
                localField: 'products.composition.settings.gemstone',
                foreignField: '_id',
                as: 'gemstone',
            },
        },
        { $unwind: '$gemstone' },

        {
            $match: {
                'gemstone.name': { $ne: 'None'},
            },
        },

        {
            $group: {
                _id: {
                    metal: '$material.name',
                    purity: '$material.purities.purity',
                    metalIcon: '$material.purities.class',
                    gem: '$gemstone.name',
                    gemIcon: '$gemstone.image',
                },
                count: { $sum: 1 },
            },
        },

        { $sort: { count: -1 } },
    ]);
};

// -------------------------------------------------------------------
// -   BASES Y ENGASATES  --------------------------------------------
// -------------------------------------------------------------------

// USO ENGASTES
export const getDesignedSettingUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),
    { $unwind: '$composition.settings' },

    {
      $match: {
        'composition.settings.setting': { $ne: null },
      },
    },

    {
      $lookup: {
        from: 'settings',
        localField: 'composition.settings.setting',
        foreignField: '_id',
        as: 'setting',
      },
    },
    { $unwind: '$setting' },

    {
      $match: {
        'setting.name': { $nin: ['Incrustado', 'Incrustado dos'] },
      },
    },

    {
      $addFields: {
        selectedClawNumber: {
          $first: {
            $filter: {
              input: '$setting.clawNumber',
              as: 'cn',
              cond: {
                $eq: [
                  { $toString: '$$cn._id' },
                  { $toString: '$composition.settings.clawNumber' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedCompatibleCut: {
          $first: {
            $filter: {
              input: '$selectedClawNumber.compatibleCuts',
              as: 'cc',
              cond: {
                $eq: [
                  { $toString: '$$cc.cut' },
                  { $toString: '$composition.settings.gemstoneCut' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedClawType: {
          $first: {
            $filter: {
              input: '$selectedCompatibleCut.clawType',
              as: 'ct',
              cond: {
                $eq: [
                  { $toString: '$$ct._id' },
                  { $toString: '$composition.settings.clawType' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $group: {
        _id: {
          setting: '$setting.name',
          clawNumber: '$selectedClawNumber.name',
          clawType: '$selectedClawType.name',
        },
        quantity: { $sum: 1 },
      },
    },

    { $sort: { quantity: -1 } },
  ]);
};

export const getBoughtSettingUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');

  return Order.aggregate([
    {
      $match: {
        state: { $in: ['ordered', 'delivered'] },
        ...yearMatch
      },
    },

    { $unwind: '$products' },
    { $unwind: '$products.composition.settings' },

    {
      $match: {
        'products.composition.settings.setting': { $ne: null },
      },
    },

    {
      $lookup: {
        from: 'settings',
        localField: 'products.composition.settings.setting',
        foreignField: '_id',
        as: 'setting',
      },
    },
    { $unwind: '$setting' },

    {
      $match: {
        'setting.name': { $nin: ['Incrustado', 'Incrustado dos'] },
      },
    },

    {
      $addFields: {
        selectedClawNumber: {
          $first: {
            $filter: {
              input: '$setting.clawNumber',
              as: 'cn',
              cond: {
                $eq: [
                  { $toString: '$$cn._id' },
                  { $toString: '$products.composition.settings.clawNumber' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedCompatibleCut: {
          $first: {
            $filter: {
              input: '$selectedClawNumber.compatibleCuts',
              as: 'cc',
              cond: {
                $eq: [
                  { $toString: '$$cc.cut' },
                  { $toString: '$products.composition.settings.gemstoneCut' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedClawType: {
          $first: {
            $filter: {
              input: '$selectedCompatibleCut.clawType',
              as: 'ct',
              cond: {
                $eq: [
                  { $toString: '$$ct._id' },
                  { $toString: '$products.composition.settings.clawType' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $group: {
        _id: {
          setting: '$setting.name',
          clawNumber: '$selectedClawNumber.name',
          clawType: '$selectedClawType.name',
        },
        quantity: { $sum: 1 },
      },
    },

    { $sort: { quantity: -1 } },
  ]);
};

// USO TALLAS
export const getDesignedSizeUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),
    {
      $match: {
        'composition.size': { $ne: null },
      },
    },
    {
      $lookup: {
        from: 'sizes',
        localField: 'composition.size',
        foreignField: '_id',
        as: 'size',
      },
    },
    { $unwind: '$size' },
    {
      $group: {
        _id: '$size.name',
        quantity: { $sum: 1 },
      },
    },
    { $sort: { quantity: -1 } },
  ]);
};

export const getBoughtSizeUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');

  return Order.aggregate([
    {
      $match: {
        state: { $in: ['ordered', 'delivered'] },
        ...yearMatch
      },
    },
    { $unwind: '$products' },
    {
      $match: {
        'products.composition.size': { $ne: null },
      },
    },
    {
      $lookup: {
        from: 'sizes',
        localField: 'products.composition.size',
        foreignField: '_id',
        as: 'size',
      },
    },
    { $unwind: '$size' },
    {
      $group: {
        _id: '$size.name',
        quantity: { $sum: 1 },
      },
    },
    { $sort: { quantity: -1 } },
  ]);
};

// COMBINACION BASES Y ENGASTES
export const getDesignedBaseSettingCombinations = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),
    { $unwind: '$composition.settings' },

    {
      $match: {
        'composition.baseStructure': { $ne: null },
        'composition.profile': { $ne: null },
        'composition.variant': { $ne: null },
        'composition.settings.setting': { $ne: null },
      },
    },

    {
      $lookup: {
        from: 'basestructures',
        localField: 'composition.baseStructure',
        foreignField: '_id',
        as: 'baseStructure',
      },
    },
    { $unwind: '$baseStructure' },

    {
      $addFields: {
        selectedProfile: {
          $first: {
            $filter: {
              input: '$baseStructure.profiles',
              as: 'profile',
              cond: {
                $eq: [
                  { $toString: '$$profile.profile' },
                  { $toString: '$composition.profile' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: 'profiles',
        localField: 'selectedProfile.profile',
        foreignField: '_id',
        as: 'profileDoc',
      },
    },
    {
      $unwind: {
        path: '$profileDoc',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        selectedVariant: {
          $first: {
            $filter: {
              input: '$selectedProfile.variants',
              as: 'variant',
              cond: {
                $eq: [
                  { $toString: '$$variant._id' },
                  { $toString: '$composition.variant' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: 'settings',
        localField: 'composition.settings.setting',
        foreignField: '_id',
        as: 'setting',
      },
    },
    { $unwind: '$setting' },

    {
      $match: {
        'setting.name': { $nin: ['Incrustado', 'Incrustado dos'] },
      },
    },

    {
      $addFields: {
        selectedClawNumber: {
          $first: {
            $filter: {
              input: { $ifNull: ['$setting.clawNumber', []] },
              as: 'cn',
              cond: {
                $eq: [
                  { $toString: '$$cn._id' },
                  { $toString: '$composition.settings.clawNumber' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedCompatibleCut: {
          $first: {
            $filter: {
              input: { $ifNull: ['$selectedClawNumber.compatibleCuts', []] },
              as: 'cc',
              cond: {
                $eq: [
                  { $toString: '$$cc.cut' },
                  { $toString: '$composition.settings.gemstoneCut' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedClawType: {
          $first: {
            $filter: {
              input: { $ifNull: ['$selectedCompatibleCut.clawType', []] },
              as: 'ct',
              cond: {
                $eq: [
                  { $toString: '$$ct._id' },
                  { $toString: '$composition.settings.clawType' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedClawTypeCut: {
          $first: {
            $filter: {
              input: { $ifNull: ['$selectedClawType.cuts', []] },
              as: 'cut',
              cond: {
                $eq: [
                  { $toString: '$$cut.cut' },
                  { $toString: '$composition.settings.gemstoneCut' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedSettingImage: {
          $first: {
            $map: {
              input: {
                $slice: [
                  { $ifNull: ['$selectedClawTypeCut.imagePerGem', []] },
                  1,
                ],
              },
              as: 'img',
              in: '$$img.image',
            },
          },
        },
      },
    },

    {
      $group: {
        _id: {
          baseStructure: '$baseStructure.name',
          profile: '$profileDoc.name',
          variant: '$selectedVariant.name',
          baseIcon: '$selectedVariant.image',

          setting: '$setting.name',
          clawNumber: '$selectedClawNumber.name',
          clawType: '$selectedClawType.name',
          settingIcon: '$selectedSettingImage',
        },
        quantity: { $sum: 1 },
      },
    },

    { $sort: { quantity: -1 } },
  ]);
};

export const getBoughtBaseSettingCombinations = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');

  return Order.aggregate([
    {
      $match: {
        state: { $in: ['ordered', 'delivered'] },
        ...yearMatch
      },
    },

    { $unwind: '$products' },
    { $unwind: '$products.composition.settings' },

    {
      $match: {
        'products.composition.baseStructure': { $ne: null },
        'products.composition.profile': { $ne: null },
        'products.composition.variant': { $ne: null },
        'products.composition.settings.setting': { $ne: null },
      },
    },

    {
      $lookup: {
        from: 'basestructures',
        localField: 'products.composition.baseStructure',
        foreignField: '_id',
        as: 'baseStructure',
      },
    },
    { $unwind: '$baseStructure' },

    {
      $addFields: {
        selectedProfile: {
          $first: {
            $filter: {
              input: '$baseStructure.profiles',
              as: 'profile',
              cond: {
                $eq: [
                  { $toString: '$$profile.profile' },
                  { $toString: '$products.composition.profile' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: 'profiles',
        localField: 'selectedProfile.profile',
        foreignField: '_id',
        as: 'profileDoc',
      },
    },
    {
      $unwind: {
        path: '$profileDoc',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        selectedVariant: {
          $first: {
            $filter: {
              input: '$selectedProfile.variants',
              as: 'variant',
              cond: {
                $eq: [
                  { $toString: '$$variant._id' },
                  { $toString: '$products.composition.variant' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: 'settings',
        localField: 'products.composition.settings.setting',
        foreignField: '_id',
        as: 'setting',
      },
    },
    { $unwind: '$setting' },

    {
      $match: {
        'setting.name': { $nin: ['Incrustado', 'Incrustado dos'] },
      },
    },

    {
      $addFields: {
        selectedClawNumber: {
          $first: {
            $filter: {
              input: { $ifNull: ['$setting.clawNumber', []] },
              as: 'cn',
              cond: {
                $eq: [
                  { $toString: '$$cn._id' },
                  { $toString: '$products.composition.settings.clawNumber' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedCompatibleCut: {
          $first: {
            $filter: {
              input: { $ifNull: ['$selectedClawNumber.compatibleCuts', []] },
              as: 'cc',
              cond: {
                $eq: [
                  { $toString: '$$cc.cut' },
                  { $toString: '$products.composition.settings.gemstoneCut' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedClawType: {
          $first: {
            $filter: {
              input: { $ifNull: ['$selectedCompatibleCut.clawType', []] },
              as: 'ct',
              cond: {
                $eq: [
                  { $toString: '$$ct._id' },
                  { $toString: '$products.composition.settings.clawType' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedClawTypeCut: {
          $first: {
            $filter: {
              input: { $ifNull: ['$selectedClawType.cuts', []] },
              as: 'cut',
              cond: {
                $eq: [
                  { $toString: '$$cut.cut' },
                  { $toString: '$products.composition.settings.gemstoneCut' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $addFields: {
        selectedSettingImage: {
          $first: {
            $map: {
              input: {
                $slice: [
                  { $ifNull: ['$selectedClawTypeCut.imagePerGem', []] },
                  1,
                ],
              },
              as: 'img',
              in: '$$img.image',
            },
          },
        },
      },
    },

    {
      $group: {
        _id: {
          baseStructure: '$baseStructure.name',
          profile: '$profileDoc.name',
          variant: '$selectedVariant.name',
          baseIcon: '$selectedVariant.image',

          setting: '$setting.name',
          clawNumber: '$selectedClawNumber.name',
          clawType: '$selectedClawType.name',
          settingIcon: '$selectedSettingImage',
        },
        quantity: { $sum: 1 },
      },
    },

    { $sort: { quantity: -1 } },
  ]);
};

// USO BASES
export const getDesignedBaseUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastEdition');  

  return Jewelry.aggregate([
    ...(year ? [{ $match: yearMatch }] : []),
    {
      $match: {
        'composition.baseStructure': { $ne: null },
        'composition.profile': { $ne: null },
        'composition.variant': { $ne: null },
      },
    },

    {
      $lookup: {
        from: 'basestructures',
        localField: 'composition.baseStructure',
        foreignField: '_id',
        as: 'baseStructure',
      },
    },
    { $unwind: '$baseStructure' },

    {
      $addFields: {
        selectedProfile: {
          $first: {
            $filter: {
              input: '$baseStructure.profiles',
              as: 'profile',
              cond: {
                $eq: [
                  { $toString: '$$profile.profile' },
                  { $toString: '$composition.profile' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: 'profiles',
        localField: 'selectedProfile.profile',
        foreignField: '_id',
        as: 'profileDoc',
      },
    },
    {
      $unwind: {
        path: '$profileDoc',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        selectedVariant: {
          $first: {
            $filter: {
              input: '$selectedProfile.variants',
              as: 'variant',
              cond: {
                $eq: [
                  { $toString: '$$variant._id' },
                  { $toString: '$composition.variant' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $group: {
        _id: {
          baseId: '$baseStructure._id',
          baseName: '$baseStructure.name',

          profileId: '$profileDoc._id',
          profileName: '$profileDoc.name',
          profileImage: '$profileDoc.image',

          variantId: '$selectedVariant._id',
          variantName: '$selectedVariant.name',
          variantImage: '$selectedVariant.image',
        },
        quantity: { $sum: 1 },
      },
    },

    { $sort: { quantity: -1 } },
  ]);
};

export const getBoughtBaseUsage = async (year = null) => {
  const yearMatch = buildYearMatch(year, 'lastUpdate');

  return Order.aggregate([
    {
      $match: {
        state: { $in: ['ordered', 'delivered'] },
        ...yearMatch
      },
    },

    { $unwind: '$products' },

    {
      $match: {
        'products.composition.baseStructure': { $ne: null },
        'products.composition.profile': { $ne: null },
        'products.composition.variant': { $ne: null },
      },
    },

    {
      $lookup: {
        from: 'basestructures',
        localField: 'products.composition.baseStructure',
        foreignField: '_id',
        as: 'baseStructure',
      },
    },
    { $unwind: '$baseStructure' },

    {
      $addFields: {
        selectedProfile: {
          $first: {
            $filter: {
              input: '$baseStructure.profiles',
              as: 'profile',
              cond: {
                $eq: [
                  { $toString: '$$profile.profile' },
                  { $toString: '$products.composition.profile' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: 'profiles',
        localField: 'selectedProfile.profile',
        foreignField: '_id',
        as: 'profileDoc',
      },
    },
    {
      $unwind: {
        path: '$profileDoc',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        selectedVariant: {
          $first: {
            $filter: {
              input: '$selectedProfile.variants',
              as: 'variant',
              cond: {
                $eq: [
                  { $toString: '$$variant._id' },
                  { $toString: '$products.composition.variant' },
                ],
              },
            },
          },
        },
      },
    },

    {
      $group: {
        _id: {
          baseId: '$baseStructure._id',
          baseName: '$baseStructure.name',

          profileId: '$profileDoc._id',
          profileName: '$profileDoc.name',
          profileImage: '$profileDoc.image',

          variantId: '$selectedVariant._id',
          variantName: '$selectedVariant.name',
          variantImage: '$selectedVariant.image',
        },
        quantity: { $sum: 1 },
      },
    },

    { $sort: { quantity: -1 } },
  ]);
};

// -------------------------------------------------------------------
// -   FACTURACIÓN  --------------------------------------------------
// -------------------------------------------------------------------

// ESTADÍSTICAS MES/AÑO (vendidos, ingresos, media precio)
export const getYearlyOrdersStats = (year) => {
    return Order.aggregate([
        {
            $match: {
                state: { $ne: "inCart" },
                cartCreationDate: {
                    
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                }
            }
        },
        {
            $project: {
                mes: { $month: "$cartCreationDate" },
                totalPrice: {
                    $toDouble: { $ifNull: ["$totalPrice", 0] }
                },
                products: 1
            }
        },
        { $unwind: "$products" },
        {
            $project: {
                mes: 1,
                orderId: "$_id",
                totalPrice: 1,
                productPrice: {
                    $toDouble: { $ifNull: ["$products.currentPrice", 0] }
                }
            }
        },
        {
            $group: {
                _id: { mes: "$mes", orderId: "$orderId" },
                totalPrice: { $first: "$totalPrice" },
                totalProductos: { $sum: 1 },
                sumaPreciosProductos: { $sum: "$productPrice" }
            }
        },
        {
            $group: {
                _id: "$_id.mes",
                totalProductos: { $sum: "$totalProductos" },
                ingresosTotales: { $sum: "$totalPrice" },
                sumaPreciosProductos: { $sum: "$sumaPreciosProductos" }
            }
        },
        {
            $project: {
                totalProductos: 1,
                ingresosTotales: 1,
                precioMedio: {
                    $cond: [
                        { $eq: ["$totalProductos", 0] },
                        0,
                        { $divide: ["$sumaPreciosProductos", "$totalProductos"] }
                    ]
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

// ESTADÍSTICAS PRECIO MES/AÑO
export const getYearlyDesignStats = (year) => {
    return Jewelry.aggregate([
        {
            $match: {
                creationDate: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                }
            }
        },
        {
            $project: {
                mes: { $month: "$creationDate" },
                price: {
                    $toDouble: { $ifNull: ["$currentPrice", 0] }
                }
            }
        },
        {
            $group: {
                _id: "$mes",
                precioMedio: { $avg: "$price" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
};

// -------------------------------------------------------------------
// -   USUARIOS  -----------------------------------------------------
// -------------------------------------------------------------------

// UBICACIÓN, SEXO Y CANTIDAD USUARIOS REGISTRADOS
export const getUserStats = () => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1); // Empezar desde el día 1 del mes hace 11 meses

    return User.aggregate([
        {
            $facet: {
                
                "totalUsuarios": [{ $count: "count" }],
                
               
                "porProvincia": [
                    { $group: { _id: "$address.province", total: { $sum: 1 } } },
                    { $sort: { total: -1 } }
                ],
                
                
                "porSexo": [
                    { $group: { _id: "$title", total: { $sum: 1 } } }
                ],
                
                // Últimos 12 meses
                "registrosMensuales": [
                    { $match: { registrationDate: { $gte: twelveMonthsAgo } } },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$registrationDate" },
                                month: { $month: "$registrationDate" }
                            },
                            total: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ]
            }
        }
    ]);
};

//Estadísticas de la colección MonthlyStat (Visitas, Logins, etc.)
export const getMonthlyUserMetrics = (year) => {
    return MonthlyStat.find({
        monthKey: { $regex: `^${year}-` }
    }).lean();
};

//Tiempo medio de diseño + núm diseños terminados
export const getAverageDesignTime = (year) => {
    return Jewelry.aggregate([
        {
            $match: {
                creationDate: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$creationDate" },
                avgTime: { $avg: "$timeSpent" },
                totalFinishedDesigns: { $sum: 1 } 
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

//Usuarios que compraron y cuántos de ellos son recurrentes
export const getBuyerStats = (year) => {
    return Order.aggregate([
        {
            $match: {
                state: { $ne: "inCart" },
                cartCreationDate: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                }
            }
        },
        {
            $lookup: {
                from: "orders", 
                localField: "user",
                foreignField: "user",
                as: "userAllOrders"
            }
        },
        {
            $group: {
                _id: { $month: "$cartCreationDate" },
                uniqueBuyers: { $addToSet: "$user" }, 
                recurrentBuyers: {
                    $addToSet: {
                        $cond: [
                            { $gt: [{ $size: "$userAllOrders" }, 1] }, 
                            "$user",
                            "$$REMOVE"
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                totalBuyers: { $size: "$uniqueBuyers" },
                totalRecurrent: { $size: "$recurrentBuyers" }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};