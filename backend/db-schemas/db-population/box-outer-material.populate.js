import BoxOuterMaterial from "../box-outer-material.schema.js";

async function populateBoxOuterMaterialCollection(deps = {}) {
  try {

    const outers = [
      { name: "Cuero blanco",        image: "whiteLeather.webp",     texture: "whiteLeather" },
      { name: "Cuero negro",         image: "blackLeather.webp",     texture: "blackLeather" },
      { name: "Cuero rojo",          image: "redLeather.webp",       texture: "redLeather" },
      { name: "Cuero azul",          image: "blueLeather.webp",      texture: "blueLeather" },
      { name: "Cuero morado",        image: "purpleLeather.webp",    texture: "purpleLeather" },
      { name: "Terciopelo blanco",   image: "whiteVelvet.webp",      texture: "whiteVelvet" },
      { name: "Terciopelo negro",    image: "blackVelvet.webp",      texture: "blackVelvet" },
      { name: "Terciopelo rojo",     image: "redVelvet.webp",        texture: "redVelvet" },
      { name: "Terciopelo azul",     image: "blueVelvet.webp",       texture: "blueVelvet" },
      { name: "Terciopelo morado",   image: "purpleVelvet.webp",     texture: "purpleVelvet" },
    ];

    const created = [];
    for (const o of outers) {
        // Evitar duplicados por nombre
        const existing = await BoxOuterMaterial.findOne({ name: o.name });

        if (existing) {
            continue; // saltar al siguiente
        }

        // Crear el material exterior nuevo
        const outer = new BoxOuterMaterial(o);
        await outer.save();

        created.push({ _id: outer._id, name: outer.name });
    }
    return { BoxOuterMaterial: created };
  } catch (error) {}
}

export default populateBoxOuterMaterialCollection;
