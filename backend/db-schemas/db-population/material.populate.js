import mongoose from "mongoose";
import Material from "../material.schema.js";

async function populateMaterialCollection(deps = {}) {
  try {

    const placeholderImage = "placeholder.image.png";

    const materials = [
      {
        material: "gold",
        name: "Oro amarillo",
        description: "Con su resplandor cálido y luminoso, el oro amarillo envuelve cada pieza en una sensación de lujo clásico y atemporal.",
        meaning: "Riqueza, pureza, divinidad y prosperidad",
        zodiac: [],
        recommendedGems: [], //esto se deja vacío aqui aposta, en el seed se termina de rellenar
        purities: [
          {
            class: "gold9K",
            purity: "9K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.34"),
            allegies: true,
            allergens: ["copper", "zinc"],
            composition: "37.5% oro, 45% plata, 15% cobre, 2.5 zinc",
            image: placeholderImage,
            texture: "gold9",
            description: "Una opción práctica y accesible que mantiene la esencia del oro en piezas duraderas.",
            meaning: "La esencia del oro en una forma fuerte y duradera, pensada para perdurar en el tiempo."
          },
          {
            class: "gold14K",
            purity: "14K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.54"),
            allegies: true,
            allergens: [],
            composition: "58.5% oro, 41.5% cobre/plata",
            image: placeholderImage,
            texture: "gold14",
            description: "Ofrece un brillo elegante y una gran durabilidad, convirtiéndose en una opción ideal para joyería de uso diario.",
            meaning: "La armonía entre belleza y resistencia, creada para acompañarte cada día."
          },
          {
            class: "gold18K",
            purity: "18K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.95"),
            allegies: false,
            allergens: ["nickel", "copper"],
            composition: "75% oro, 25% cobre/plata",
            image: placeholderImage,
            texture: "gold18",
            description: "Una de las purezas más valoradas en alta joyería por su equilibrio entre lujo, belleza y durabilidad.",
            meaning: "El equilibrio perfecto entre pureza y excelencia, donde el oro revela su esencia más noble."
          }
        ]
      },
      {
        material: "gold",
        name: "Oro rosa",
        description: "Con su tono delicado y romántico, el oro rosa aporta una elegancia suave que realza la belleza de cada detalle.",
        meaning: "Amor, romanticismo y elegancia contemporánea",
        zodiac: [],
        recommendedGems: [],
        purities: [
        {
            class: "roseGold9K",
            purity: "9K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.10"),
            allegies: true,
            allergens: ["copper"],
            composition: "37.5% oro, 60% cobre y 2.5% plata",
            image: placeholderImage,
            texture: "roseGold9",
            description: "Con un tono rosado más marcado y una gran resistencia para el uso cotidiano.",
            meaning: "La esencia cálida del oro en una forma fuerte y llena de personalidad."
        },
        {
            class: "roseGold14K",
            purity: "14K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.50"),
            allegies: true,
            allergens: ["copper"],
            composition: "58.5% oro, 32% cobre y 9.5% plata",
            image: placeholderImage,
            texture: "roseGold14",
            description: "Con una mayor proporción de cobre, lo que intensifica ligeramente su tono rosado y aumenta su resistencia. Es una opción ideal para joyas que combinan belleza, carácter y durabilidad.",
            meaning: "Un equilibrio entre calidez y fortaleza que acompaña cada momento con estilo."
        },
        {
            class: "roseGold18K",
            purity: "18K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.90"),
            allegies: true,
            allergens: ["copper"],
            composition: "75% oro, 16% cobre y 9% plata",
            image: placeholderImage,
            texture: "roseGold18",
            description: "75% de oro puro su alta pureza aporta un brillo cálido y una elegancia refinada muy apreciada en alta joyería.",
            meaning: "La pureza del oro envuelta en un tono cálido que expresa romanticismo y sofisticación."
        }
        ]
    },
    {
        material: "gold",
        name: "Oro blanco",
        description: "Con su brillo sutil y sofisticado, el oro blanco captura la esencia de la elegancia eterna en cada detalle.",
        meaning: "Amor, romanticismo y elegancia contemporánea",
        zodiac: [],
        recommendedGems: [],
        purities: [
        {
            class: "whiteGold9K",
            purity: "9K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.2"),
            allegies: true,
            allergens: ["zinc", "nickel"],
            composition: "37.5% oro, 40% cobre y 22.5% zinc",
            image: placeholderImage,
            texture: "whiteGold",
            description: "Es una opción práctica que conserva la estética clara y elegante del oro blanco.",
            meaning: "La elegancia clara del oro diseñada para acompañar cada día."
        },
        {
            class: "whiteGold14K",
            purity: "14K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.56"),
            allegies: true,
            allergens: ["zinc", "nickel"],
            composition: "58.5% oro, 25% níquel y 16.5% zinc",
            image: placeholderImage,
            texture: "whiteGold",
            description: "Mantiene un brillo elegante y es muy apreciado por su resistencia en joyería de uso diario.",
            meaning: "Brillo contemporáneo y resistencia en perfecta armonía."
        },
        {
            class: "whiteGold18K",
            purity: "18K",
            pricePermm3: mongoose.Types.Decimal128.fromString("1.96"),
            allegies: true,
            allergens: ["zinc", "nickel"],
            composition: "75% oro, 15% níquel y 9% zinc",
            image: placeholderImage,
            texture: "whiteGold",
            description: "Tono blanco más suave y mayor contenido en oro.",
            meaning: "La pureza del oro reinterpretada en una elegancia moderna y luminosa."
        }
        ]
    },
    {
      material: "platinum",
      name: "Platino",
      description: "Metal noble, de color blanco plateado y gran durabilidad.",
      meaning: "Amor, la resistencia y las relaciones a largo plazo",
      zodiac: ["capricorn"],
      recommendedGems: [],
      purities: [
        {
          class: "Pt950",
          purity: "Pt950",
          pricePermm3: mongoose.Types.Decimal128.fromString("1.49"),
          allegies: false,
          allergens: [],
          composition: "95% platino, 5% rutenio/iridio/cobalto",
          image: placeholderImage,
          texture: "whiteGold",
          description: "Muy denso y resistente al desgaste.",
          meaning: "Usado en anillos de compromiso de alta calidad."
        }
      ]
    }
  ];

    const created = [];
    for (const materialData of materials) {
        // Evitar duplicados por material + name
        const existing = await Material.findOne({ 
            material: materialData.material, 
            name: materialData.name 
        });

        if (existing) {
            continue; // saltar al siguiente
        }

        // Crear el material nuevo
        const material = new Material(materialData);
        await material.save();

        created.push(material);
    }

    return { Material: created };
  } catch (error) {
    console.error("Error al poblar Material:", error);
  }
}

export default populateMaterialCollection;
