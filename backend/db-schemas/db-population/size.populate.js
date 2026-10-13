import mongoose from "mongoose";
import Size from "../size.schema.js";

async function populateSizeCollection(deps = {}) {
  try {

    const sizes = [
      { name: "10", system: "ES-IT" },
      { name: "12", system: "ES-IT" },
      { name: "14", system: "ES-IT" },
      { name: "16", system: "ES-IT" },
      { name: "18", system: "ES-IT" },
      { name: "20", system: "ES-IT" }
    ];

    const created = [];
    for (const sizeData of sizes) {
        // Evitar duplicados por name + system
        const existing = await Size.findOne({ 
            name: sizeData.name, 
            system: sizeData.system 
        });

        if (existing) {
            continue; // saltar a la siguiente talla
        }

        // Crear la talla nueva
        const size = new Size(sizeData);
        await size.save();

        created.push({ _id: size._id, name: size.name });
        }
    return { Size: created };

  } catch (error) {
    console.error("Error al poblar Size:", error);
  }
}

export default populateSizeCollection;
