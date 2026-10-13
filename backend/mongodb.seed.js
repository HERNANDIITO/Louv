import mongoose from "./db.js";

import populateBaseStructureCollection from  "./db-schemas/db-population/base-structure.populate.js";
import populateBoxInnerMaterialCollection from "./db-schemas/db-population/box-inner-material.populate.js";
import populateBoxOuterMaterialCollection from "./db-schemas/db-population/box-outer-material.populate.js";
import populateBoxDetailMaterialCollection from "./db-schemas/db-population/box-detail-material.populate.js";
import populateBoxCollection from "./db-schemas/db-population/box.populate.js";
import populateCutCollection from "./db-schemas/db-population/cut.populate.js";
import populateEmployeeCollection from "./db-schemas/db-population/employee.populate.js";
import populateGemstoneCollection from "./db-schemas/db-population/gemstone.populate.js";
import populateMaterialCollection from "./db-schemas/db-population/material.populate.js";
import populateProfileCollection from "./db-schemas/db-population/profile.populate.js";
import populateSizeCollection from "./db-schemas/db-population/size.populate.js";
import populateUserCollection from "./db-schemas/db-population/users.populate.js";
import populateOrderCollection from "./db-schemas/db-population/order.populate.js";
import populateJewelryCollection from "./db-schemas/db-population/jewelry.populate.js";
import populateSettingCollection from "./db-schemas/db-population/setting.populate.js";
import linkMaterialGemstone from "./db-schemas/db-population/link-material-gemstone.populate.js";

// Orquestador que ejecuta seeds en orden lógico y pasa deps entre ellos.
async function runSeeds() {
    // Orden de ejecución basado en dependencias detectadas en los schemas
    const sequence = [
        populateUserCollection,
        populateEmployeeCollection,
        populateSizeCollection,
        populateProfileCollection,
        populateCutCollection,
        populateBoxDetailMaterialCollection,
        populateBoxInnerMaterialCollection,
        populateBoxOuterMaterialCollection,
        populateBoxCollection,
        populateMaterialCollection,
        populateGemstoneCollection,
        linkMaterialGemstone,
        populateSettingCollection,
        populateBaseStructureCollection,
        populateJewelryCollection,
        populateOrderCollection
    ];

    const deps = {};

    for (const seedFn of sequence) {
        try {
            const result = await seedFn(deps);
            if (result && typeof result === 'object') {
                for (const key of Object.keys(result)) {
                    if (!deps[key]) deps[key] = [];
                    deps[key] = deps[key].concat(result[key]);
                }
            }
        } catch (e) {
            console.error(`Error ejecutando seed ${seedFn.name}:`, e);
        }
    }
}

// Ejecutar orquestador
runSeeds()
    .then(() => {
        // Añadir: Cerramos la conexión a la base de datos después de completar la siembra
        return mongoose.connection.close(); 
    })
    .catch(e => {
        console.error('Error en runSeeds:', e);
        // Si hay un error, salir del proceso de Node
        process.exit(1);
    });