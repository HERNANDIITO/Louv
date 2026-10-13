import Material from "../material.schema.js";
import Gemstone from "../gemstone.schema.js";

async function linkMaterialGemstone() {
  try {

    // Obtener todos los materiales y gemas
    const materials = await Material.find();
    const gemstones = await Gemstone.find();

    // Crear mapas por nombre
    const matByName = {};
    const gemByName = {};

    for (const m of materials) matByName[m.name] = m._id;
    for (const g of gemstones) gemByName[g.name] = g._id;

    // Actualizar materiales con gemas recomendadas
    const materialsToUpdate = [
      {
        name: "Oro amarillo", //mas adelante, citrino
        gems: ["Rubí", "Diamante", "Esmeralda"]
      },
      {
        name: "Oro rosa",
        gems: ["Rubí", "Diamante", "Amatista"]
      },
      {
        name: "Platino",
        gems: ["Aguamarina", "Amatista"]
      }
    ];

    for (const matUpdate of materialsToUpdate) {
      const gemIds = matUpdate.gems
        .map(gemName => gemByName[gemName])
        .filter(Boolean);

      if (gemIds.length > 0) {
        await Material.updateOne(
          { name: matUpdate.name },
          { recommendedGems: gemIds }
        );
      }
    }

    // Actualizar gemas con materiales recomendados
    const gemsToUpdate = [
      {
        name: "Diamante",
        materials: ["Oro amarillo","Oro rosa", "Platino"]
      },
      {
        name: "Rubí",
        materials: ["Oro amarillo", "Oro rosa"]
      },
      {
        name: "Aguamarina",
        materials: ["Platino"]
      },
      {
        name: "Esmeralda",
        materials: ["Oro amarillo"]
      },
      {
        name: "Amatista",
        materials: ["Oro rosa", "Platino"]
      },
    ];

    for (const gemUpdate of gemsToUpdate) {
      const matIds = gemUpdate.materials
        .map(matName => matByName[matName])
        .filter(Boolean);

      if (matIds.length > 0) {
        await Gemstone.updateOne(
          { name: gemUpdate.name },
          { recommendedMaterials: matIds }
        );
      }
    }

    return { Material, Gemstone };
  } catch (error) {}
}

export default linkMaterialGemstone;
