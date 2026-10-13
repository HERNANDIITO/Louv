import { MetalGemCombinationItem } from "./metal-gem-combination-item.interface";

export interface MetalGemCombinationsResponse {
    result: 'OK';
    metalGemCombinations: {
        designed: MetalGemCombinationItem[];
        bought: MetalGemCombinationItem[];
    };
}