import Box from "../box.schema.js";
import BoxOuterMaterial from "../box-outer-material.schema.js";
import BoxInnerMaterial from "../box-inner-material.schema.js";
import BoxDetailMaterial from "../box-detail-material.schema.js";

async function populateBoxCollection(deps = {}) {
  try {

    const placeholderModel = "placeholder.3dmodel.glb";
    const placeholderImage = "placeholder.image.png";

    // Obtener materials existentes (si no hay, los arrays quedarán vacíos)
    const outerMaterials = await BoxOuterMaterial.find();
    const innerMaterials = await BoxInnerMaterial.find();
    const detailMaterials = await BoxDetailMaterial.find();

    const getIds = (arr, count = 2) => (arr && arr.length ? arr.slice(0, count).map(x => x._id) : []);

    const boxes = [
      {
        name: "Caja Cuadrada",
        description: "Caja de anillo cuadrada.",
        model: "caja_cuadrada",
        image: "cuadrada.webp",
        outerMaterials: getIds(outerMaterials, 10),
        innerMaterials: getIds(innerMaterials, 10),
        detailMaterials: getIds(detailMaterials, 1)
      },
      {
        name: "Caja Redonda",
        description: "Caja de anillo redonda",
        model: "caja_circular",
        image: "circular.webp",
        outerMaterials: getIds(outerMaterials, 10),
        innerMaterials: getIds(innerMaterials, 10),
        detailMaterials: getIds(detailMaterials, 1)
      },
      {
        name: "Caja Corazón",
        description: "Caja de anillo corazón",
        model: "caja_corazon",
        image: "corazón.webp",
        outerMaterials: getIds(outerMaterials, 10),
        innerMaterials: getIds(innerMaterials, 10),
        detailMaterials: getIds(detailMaterials, 1)
      }
    ];

    const created = [];
    for (const b of boxes) {
        // Evitar duplicados por nombre
        const existing = await Box.findOne({ name: b.name });

        if (existing) {
            continue; // saltar a la siguiente
        }

        // Crear la caja nueva
        const box = new Box(b);
        await box.save();

        created.push({  _id: box._id, name: box.name });
    }

    return { Box: created };
  } catch (error) {}
}

export default populateBoxCollection;
