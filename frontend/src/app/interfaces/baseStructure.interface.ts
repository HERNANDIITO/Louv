import { Cut } from "./cut.interface";
import { SETTING_SIZES } from "./enums";
import { Gemstone } from "./gemStones.interface";
import { Material } from "./material.interface";
import { Profile } from "./profile.interface";
import { ClawNumber, ClawType, Setting } from "./setting.interface";

export interface BaseStructureVariantSetting {
    setting?: Setting;
    gemstone?: Gemstone;
    gemstoneCut?: Cut;
    clawNumber?: ClawNumber;
    clawType?: ClawType;
    pattern?: Pattern[];
}

export interface Pattern {
    gemstone: Gemstone,
    isSynthetic: boolean;
}

export interface SettingInfo {
    compatibleSettings: {
        setting: Setting;
        scalePerSettingSize: {
            size: SETTING_SIZES;
            scale: number;
        }[];
    }[];
    positionAndRotationPerSettingSize: {
        size: SETTING_SIZES;
        positionX: number;
        positionY: number;
        positionZ: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        rotationW: number;
    }[];
    defaultsettingSize: SETTING_SIZES;
    defaultSettings: BaseStructureVariantSetting[];
}

export interface BaseStructureVariant {
    _id: string;
    name: string;
    image: string;
    extraPrice: number;
    modelBySize: {
        size: SETTING_SIZES;
        model?: string;
        volume?: number;
    }[];
    settingsInfo: SettingInfo[];
}

export interface BaseStructureProfile {
    profile: Profile;
    model?: string;
    volume?: number;
    variants: BaseStructureVariant[];
    _id: string;
}

export interface BaseStructure {
    _id: string;
    name: string;
    description: string;
    defaultDesign: {
        material?: Material;
        profile?: Profile;
    };
    profiles: BaseStructureProfile[];
}
