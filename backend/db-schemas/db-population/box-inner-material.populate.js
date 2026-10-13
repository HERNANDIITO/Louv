import BoxInnerMaterial from "../box-inner-material.schema.js";

async function populateBoxInnerMaterialCollection(deps = {}) {
  try {

    const inners = [
      { name: "Seda blanca",        image: "whiteSilk.webp",     texture: "whiteSilk" },
      { name: "Seda negra",         image: "blackSilk.webp",     texture: "blackSilk" },
      { name: "Seda roja",          image: "redSilk.webp",       texture: "redSilk" },
      { name: "Seda azul",          image: "blueSilk.webp",      texture: "blueSilk" },
      { name: "Seda morada",        image: "purpleSilk.webp",    texture: "purpleSilk" },
      { name: "Terciopelo blanco",  image: "whiteVelvet.webp",   texture: "whiteVelvet" },
      { name: "Terciopelo negro",   image: "blackVelvet.webp",   texture: "blackVelvet" },
      { name: "Terciopelo rojo",    image: "redVelvet.webp",     texture: "redVelvet" },
      { name: "Terciopelo azul",    image: "blueVelvet.webp",    texture: "blueVelvet" },
      { name: "Terciopelo morado",  image: "purpleVelvet.webp",  texture: "purpleVelvet" },
    ];

    const created = [];
    for (const i of inners) {
        // Evitar duplicados por nombre
        const existing = await BoxInnerMaterial.findOne({ name: i.name });

        if (existing) {
            continue; // saltar al siguiente
        }

        // Crear el material interior nuevo
        const inner = new BoxInnerMaterial(i);
        await inner.save();

        created.push({ _id: inner._id, name: inner.name });
    }


    return { BoxInnerMaterial: created };
  } catch (error) {}
}

export default populateBoxInnerMaterialCollection;
