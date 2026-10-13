import { Cut } from "./cut.interface";
import { ZODIAC_SIGNS, GEMSTONE_COLORS } from "./enums";
import { Material } from "./material.interface";

export interface GemstoneQuality {
    _id: string;
    caratRangeMin: number;
    caratRangeMax: number;
    minScaleFactor: number;
    maxScaleFactor: number;
    pricePerCaratNatural?: number;
    pricePerCaratSynthetic?: number;
}

export interface Gemstone {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    imagePerCut: { cut: Cut; image: string }[];
    meaning?: string;
    zodiac?: (ZODIAC_SIGNS)[];
    recommendedMaterials?: Material[];
    recommendedCuts?: Cut[];
    color?: (GEMSTONE_COLORS)[];
    texture: string;
    hardness: number;
    hasSynthetic: boolean;
    origin: string;
    qualities: GemstoneQuality[];
}
