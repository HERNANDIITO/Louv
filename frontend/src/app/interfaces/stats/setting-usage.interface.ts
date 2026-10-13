import { UsageItem } from "./usage-item.interface";

export interface SettingUsageResponse {
    result: 'OK';
    settingUsage: {
        designed: UsageItem[];
        bought: UsageItem[];
    };
}