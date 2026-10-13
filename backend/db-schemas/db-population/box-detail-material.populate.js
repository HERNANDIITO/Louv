import BoxDetailMaterial from "../box-detail-material.schema.js";

async function populateBoxDetailMaterialCollection(deps = {}) {
  try {

    const details = [
      { name: "Latón macizo", image: "whiteLeather.webp", texture: "brushed-brass" },
      { name: "Oro 24K", image: "whiteLeather.webp", texture: "polished-gold" },
      { name: "Acero inoxidable", image: "whiteLeather.webp", texture: "mirror-steel" },
      { name: "Plata de ley", image: "whiteLeather.webp", texture: "sterling-silver" },
      { name: "Níquel negro", image: "whiteLeather.webp", texture: "dark-gloss" },
      { name: "Cobre cepillado", image: "whiteLeather.webp", texture: "raw-copper" }
    ];

    const created = [];
    for (const d of details) {
        // Evitar duplicados por nombre
        const existing = await BoxDetailMaterial.findOne({ name: d.name });

        if (existing) {
            continue; // saltar al siguiente
        }

        // Crear el detalle nuevo
        const detail = new BoxDetailMaterial(d);
        await detail.save();

        created.push({ _id: detail._id, name: detail.name });
    }
    return { BoxDetailMaterial: created };
  } catch (error) {}
}

export default populateBoxDetailMaterialCollection;
