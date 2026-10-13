import { BaseSettingCombination } from "./base-setting-combitantion-item.interface";

export interface BaseSettingCombinationsResponse {
    result: 'OK';
    baseSettingCombinations: {
        designed: BaseSettingCombination[];
        bought: BaseSettingCombination[];
    };
}