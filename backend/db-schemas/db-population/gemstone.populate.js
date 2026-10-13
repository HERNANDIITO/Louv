import mongoose from "mongoose";
import Gemstone from "../gemstone.schema.js";
import Cut from "../cut.schema.js";
import Material from "../material.schema.js";

/**
 * Calcula los factores de escala de 1ct y de Xct
 */
const calculateScales = (caratsGemvsDiam, ct) => {
    const scaleGem1ct = Math.pow(1 / caratsGemvsDiam, 1/3);

    const scaleDiamXct = Math.pow(ct, 1/3);
    const scaleGemXct = scaleDiamXct * scaleGem1ct;

    return scaleGemXct.toFixed(3).toString()
};

/**
 * Calcula el precio por quilate para un rango dado
 * El precio por quilate suele subir según aumenta el tamaño (rareza)
 */
const calculatePricePerCarat = (basePrice, carats, exponency) => {
    // A más quilates, el precio por unidad sube exponencialmente
    const totalPrice = basePrice * Math.pow(carats, exponency);
    return (totalPrice / carats).toFixed(2).toString();
};


async function populateGemstoneCollection(deps = {}) {
  try {

    const placeholderImage = "placeholder.image.png";

    // Cargar cortes disponibles para referencias
    const cuts = await Cut.find();
    const cutByName = {};
    for (const c of cuts) cutByName[c.name] = c._id;

    const pickCut = (name) => cutByName[name] || null;

    const gemstones = [
      {
        name: "Diamante",
        description: "Piedra extremadamente dura y brillante.",
        image: "diamante.webp",
        imagePerCut: [
          { cut: pickCut("Brillante"), image: placeholderImage },
          { cut: pickCut("Oval Clásico"), image: placeholderImage },
          { cut: pickCut("Oval East-West"), image: placeholderImage }
        ].filter(x => x.cut),
        meaning: "Amor eterno, claridad y fuerza.",
        zodiac: [],
        recommendedMaterials: [], //esto se deja vacío aqui aposta, en el seed se termina de rellenar
        recommendedCuts: [ pickCut("Brillante"), pickCut("Oval Clásico"), pickCut("Oval East-West") ].filter(Boolean),
        color: ["white"],
        texture: "diamond",
        hardness: 10,
        hasSynthetic: true,
        origin: "África, India, Russia, China, Australia, Brazil",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 0.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(200, 0.25, 1.55)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(100, 0.25, 1.55))
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(400, 0.75, 1.55)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 0.75, 1.55))
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(400, 1.25, 1.55)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 1.25, 1.55))
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 2)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(400, 1.75, 1.55)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 1.75, 1.55))
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 2.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(400, 2.25, 1.55)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 2.25, 1.55))
          }
        ]
      },
      {
        name: "Rubí",
        description: "Piedra preciosa roja, símbolo de pasión y protección.",
        image: "rubi.webp",
        imagePerCut: [ { cut: pickCut("Brillante"), image: placeholderImage } ].filter(x => x.cut),
        meaning: "Poder, pasión y protección.",
        zodiac: ["aries"],
        recommendedMaterials: [],
        recommendedCuts: [ pickCut("Brillante"), pickCut("Oval Clásico"), pickCut("Oval East-West") ].filter(Boolean),
        color: ["red"],
        texture: "ruby",
        hardness: 9,
        hasSynthetic: true,
        origin: "Birmania, Tanzania, Tailandia, Afganistán, Sri Lanka, Vietnam",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 0.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(180, 0.25, 1.45)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(90, 0.25, 1.45))
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(350, 0.75, 1.45)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(250, 0.75, 1.45))
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(350, 1.25, 1.45)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(250, 1.25, 1.45))
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 2)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(350, 1.75, 1.45)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(250, 1.75, 1.45))
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 2.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(350, 2.25, 1.45)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(250, 2.25, 1.45))
          }
        ]
      },
      {
        name: "Esmeralda",
        description: "Piedra preciosa verde, símbolo de renovación, sabiduría y amor eterno.",
        image: "esmeralda.webp",
        imagePerCut: [ { cut: pickCut("Brillante"), image: placeholderImage } ].filter(x => x.cut),
        meaning: "Esperanza, crecimiento y equilibrio emocional.",
        zodiac: ["gemini", "taurus", "cancer"],
        recommendedMaterials: [],
        recommendedCuts: [ pickCut("Brillante"), pickCut("Oval Clásico"), pickCut("Oval East-West") ].filter(Boolean),
        color: ["green"],
        texture: "emerald",
        hardness: 7.5-8,
        hasSynthetic: true,
        origin: "Colombia, Zambia, Brasil, Afganistán, Pakistán, Etiopía",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 0.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(190, 0.25, 1.40)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(110, 0.25, 1.40))
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 1)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(370, 0.75, 1.40)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(175, 0.75, 1.40))
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 1.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(370, 1.25, 1.40)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(175, 1.25, 1.40))
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 2)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(370, 1.75, 1.40)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(175, 1.75, 1.40))
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.26, 2.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(370, 2.25, 1.40)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(175, 2.25, 1.40))
          }
        ]
      },
      {
        name: "Zafiro",
        description: "Piedra preciosa conocida por su intenso color azul y su extraordinaria dureza, símbolo de nobleza y sabiduría.",
        image: "zafiro.webp",
        imagePerCut: [ { cut: pickCut("Brillante"), image: placeholderImage } ].filter(x => x.cut),
        meaning: "Sabiduría, lealtad y protección.",
        zodiac: ["virgo", "libra", "sagittarius"],
        recommendedMaterials: [],
        recommendedCuts: [ pickCut("Brillante"), pickCut("Oval Clásico"), pickCut("Oval East-West") ].filter(Boolean),
        color: ["blue"],
        texture: "sapphire",
        hardness: 9,
        hasSynthetic: true,
        origin: "Sri Lanka, Myanmar, Madagascar, Tailandia, Australia, Cachemira (India)",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 0.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(150, 0.25, 1.41)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(80, 0.25, 1.41))
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(325, 0.75, 1.41)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(180, 0.75, 1.41))
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(325, 1.25, 1.41)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(180, 1.25, 1.41))
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 2)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(325, 1.75, 1.41)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(180, 1.75, 1.41))
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.41, 2.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(325, 2.25, 1.41)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(180, 2.25, 1.41))
          }
        ]
      },
      {
        name: "Amatista",
        description: "Variedad violeta del cuarzo apreciada por su brillo y tonalidad profunda, utilizada en joyería desde la antigüedad.",
        image: "amatista.webp",
        imagePerCut: [ { cut: pickCut("Brillante"), image: placeholderImage } ].filter(x => x.cut),
        meaning: "Calma, claridad mental y equilibrio espiritual",
        zodiac: ["pisces", "aries", "aquarius"],
        recommendedMaterials: [],
        recommendedCuts: [ pickCut("Brillante"), pickCut("Oval Clásico"), pickCut("Oval East-West") ].filter(Boolean),
        color: ["purple"],
        texture: "amethyst",
        hardness: 7,
        hasSynthetic: true,
        origin: "Brasil, Uruguay, Zambia, Rusia, Bolivia",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 0.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(155, 0.25, 1.3)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(50, 0.25, 1.3))
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 1)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 0.75, 1.3)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(100, 0.75, 1.3))
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 1.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 1.25, 1.3)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(100, 1.25, 1.3))
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 2)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 1.75, 1.3)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(100, 1.75, 1.3))
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.10, 2.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(300, 2.25, 1.3)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(100, 2.25, 1.3))
          }
        ]
      },
      {
        name: "Turmalina",
        description: "Variedad azul de la turmalina, conocida por sus tonos que van del azul profundo al azul verdoso y su gran rareza.",
        image: "turmalina.webp",
        imagePerCut: [ { cut: pickCut("Brillante"), image: placeholderImage } ].filter(x => x.cut),
        meaning: "Comunicación, claridad emocional y intuición.",
        zodiac: ["libra", "scorpio"],
        recommendedMaterials: [],
        recommendedCuts: [ pickCut("Brillante"), pickCut("Oval Clásico"), pickCut("Oval East-West") ].filter(Boolean),
        color: ["blue"],
        texture: "blueTourmaline",
        hardness: 7,
        hasSynthetic: true,
        origin: "Brasil, Afganistán, Nigeria, Mozambique, Madagascar",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 0.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(210, 0.25, 1.25)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(103, 0.25, 1.25))
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 1)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(290, 0.75, 1.25)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(133, 0.75, 1.25))
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 1.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(290, 1.25, 1.25)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(133, 1.25, 1.25))
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 2)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(290, 1.75, 1.25)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(133, 1.75, 1.25))
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.28, 2.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(290, 2.25, 1.25)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(133, 2.25, 1.25))
          }
        ]
      },
      {
        name: "Aguamarina",
        description: "Piedra preciosa azul clara asociada a la calma y la comunicación.",
        image: "aguamarina.webp",
        imagePerCut: [
          { cut: pickCut("Brillante"), image: placeholderImage },
          { cut: pickCut("Oval Clásico"), image: placeholderImage },
          { cut: pickCut("Oval East-West"), image: placeholderImage }
        ].filter(x => x.cut),
        meaning: "Calma, claridad mental y comunicación.",
        zodiac: ["pisces"],
        recommendedMaterials: [],
        recommendedCuts: [ // esmeralda, oval
          pickCut("Brillante")
        ].filter(Boolean),
        color: ["blue"],
        texture: "aquamarine",
        hardness: 7.5,
        hasSynthetic: false,
        origin: "Brasil, Afganistán, India",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 0.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(137, 0.25, 1.15)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(69, 0.25, 1.15))
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 1)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(280, 0.75, 1.15)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(60, 0.75, 1.15))
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 1.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(280, 1.25, 1.15)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(60, 1.25, 1.15))
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 2)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(280, 1.75, 1.15)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(60, 1.75, 1.15))
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1.31, 2.5)),
            pricePerCaratNatural: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(280, 2.25, 1.15)),
            pricePerCaratSynthetic: mongoose.Types.Decimal128.fromString(calculatePricePerCarat(60, 2.25, 1.15))
          }
        ]
      },
      {
        name: "None",
        description: "Piedra extremadamente dura y brillante.",
        image: "diamante.webp",
        imagePerCut: [
          { cut: pickCut("Brillante"), image: placeholderImage }
        ].filter(x => x.cut),
        meaning: "Amor eterno, claridad y fuerza.",
        zodiac: [],
        recommendedMaterials: [], //esto se deja vacío aqui aposta, en el seed se termina de rellenar
        recommendedCuts: [ pickCut("Brillante"), pickCut("Oval Clásico"), pickCut("Oval East-West") ].filter(Boolean),
        color: ["white"],
        texture: "none",
        hardness: 10,
        hasSynthetic: true,
        origin: "África, India, Russia, China, Australia, Brazil",
        qualities: [
          {
            caratRangeMin: 0.001,
            caratRangeMax: 0.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 0.001)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 0.5)),
            pricePerCaratNatural: 0.0,
            pricePerCaratSynthetic: 0.0
          },  
          {
            caratRangeMin: 0.5,
            caratRangeMax: 1.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 0.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1)),
            pricePerCaratNatural: 0.0,
            pricePerCaratSynthetic: 0.0
          },
          {
            caratRangeMin: 1.0,
            caratRangeMax: 1.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1.5)),
            pricePerCaratNatural: 0.0,
            pricePerCaratSynthetic: 0.0
          },
          {
            caratRangeMin: 1.5,
            caratRangeMax: 2.0,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 1.5)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 2)),
            pricePerCaratNatural: 0.0,
            pricePerCaratSynthetic: 0.0
          },
          {
            caratRangeMin: 2.0,
            caratRangeMax: 2.5,
            minScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 2)),
            maxScaleFactor: mongoose.Types.Decimal128.fromString(calculateScales(1, 2.5)),
            pricePerCaratNatural: 0.0,
            pricePerCaratSynthetic: 0.0
          }
        ]
      }
    ];

    const created = [];
    for (const g of gemstones) {
        // preparar documento filtrando referencias vacías
        const doc = { ...g };
        if (doc.imagePerCut) doc.imagePerCut = doc.imagePerCut.filter(Boolean);
        if (doc.recommendedMaterials) doc.recommendedMaterials = doc.recommendedMaterials.filter(Boolean);
        if (doc.recommendedCuts) doc.recommendedCuts = doc.recommendedCuts.filter(Boolean);

        // Buscar si ya existe
        const existing = await Gemstone.findOne({ name: doc.name });

        if (existing) {
            continue;
        }

        // Crear nueva
        const gemstone = new Gemstone(doc);
        await gemstone.save();

        created.push({ _id: gemstone._id, name: gemstone.name });
        }
    return { Gemstone: created };
  } catch (error) {}
}

export default populateGemstoneCollection;
