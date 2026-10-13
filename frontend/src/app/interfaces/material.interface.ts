import { ALLERGENS, MATERIALS, PURITIES, ZODIAC_SIGNS } from "./enums";
import { Gemstone } from "./gemStones.interface";

export interface MaterialPurity {
    _id: string;
    class: string;
    purity: PURITIES;
    pricePermm3: number;
    allegies: boolean;
    allergens?: (ALLERGENS)[];
    composition: string;
    image: string;
    texture: string;
    description?: string;
    meaning?: string;
}

export interface Material {
    _id: string;
    material: MATERIALS;
    name: string;
    description?: string;
    meaning?: string;
    zodiac?: (ZODIAC_SIGNS)[];
    recommendedGems?: Gemstone[];
    purities: MaterialPurity[];
}
