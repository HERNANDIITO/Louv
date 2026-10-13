import mongoose from "mongoose";
import Cut from "../cut.schema.js";

async function populateCutCollection(deps = {}) {
  try {

    const cuts = [
      {
        name: "Brillante",
        description: "Corte clásico con 57 facetas para máximo brillo y simetría.",
        model: "gem_round_1q.gltf",
        image: "brillante.svg",
        width: mongoose.Types.Decimal128.fromString("6.5"),
        height: mongoose.Types.Decimal128.fromString("3.94"),
        depth: mongoose.Types.Decimal128.fromString("6.5")
      },
      {
        name: "Oval Clásico",
        description: "Corte con forma oval orientado verticalmente, combina elegancia y perfil alargado.",
        model: "gem_oval_V_1q.gltf",
        image: "oval.svg",
        width: mongoose.Types.Decimal128.fromString("8.00"),
        height: mongoose.Types.Decimal128.fromString("3.06"),
        depth: mongoose.Types.Decimal128.fromString("5.62")
      },
      {
        name: "Oval East-West",
        description: "Corte con forma oval orientado horizontalmente, combina elegancia y perfil alargado.",
        model: "gem_oval_H_1q.gltf",
        image: "ovalRotado.svg",
        width: mongoose.Types.Decimal128.fromString("5.62"),
        height: mongoose.Types.Decimal128.fromString("3.06"),
        depth: mongoose.Types.Decimal128.fromString("8.00")
      },
      {
        name: "Princesa",
        description: "Corte cuadrado o ligeramente rectangular con múltiples facetas que potencian el brillo y le dan un estilo moderno.",
        model: "gem_princess.gltf",
        image: "princesa.svg",
        width: mongoose.Types.Decimal128.fromString("5.5"),
        height: mongoose.Types.Decimal128.fromString("4.02"),
        depth: mongoose.Types.Decimal128.fromString("5.5")
      },
      {
        name: "Marquesa",
        description: "Corte alargado con extremos puntiagudos que resalta el brillo y da a la gema una apariencia elegante y estilizada.",
        model: "gem_marq.gltf",
        image: "marquesa.svg",
        width: mongoose.Types.Decimal128.fromString("5"),
        height: mongoose.Types.Decimal128.fromString("2.78"),
        depth: mongoose.Types.Decimal128.fromString("10")
      },
      {
        name: "Pera",
        description: "Corte en forma de lágrima que combina brillo y elegancia, aportando una apariencia delicada y estilizada.",
        model: "gem_pera.gltf",
        image: "pera.svg",
        width: mongoose.Types.Decimal128.fromString("8"),
        height: mongoose.Types.Decimal128.fromString("3.06"),
        depth: mongoose.Types.Decimal128.fromString("5")
      },
      {
        name: "Esmeralda",
        description: "Corte rectangular con facetas escalonadas que resalta la claridad de la gema con un brillo elegante y sofisticado.",
        model: "gem_esme.gltf",
        image: "esmeralda.svg",
        width: mongoose.Types.Decimal128.fromString("7"),
        height: mongoose.Types.Decimal128.fromString("3.27"),
        depth: mongoose.Types.Decimal128.fromString("5")
      }
    ];

    const created = [];
    for (const c of cuts) {
        // Evitar duplicados por nombre
        const existing = await Cut.findOne({ name: c.name });

        if (existing) {
            continue; // saltar al siguiente
        }

        // Crear el corte nuevo
        const cut = new Cut(c);
        await cut.save();

        created.push({ _id: cut._id, name: cut.name });
    }

    return { Cut: created };
  } catch (error) {
    console.error("Error al poblar Cut:", error);
  }
}

export default populateCutCollection;
