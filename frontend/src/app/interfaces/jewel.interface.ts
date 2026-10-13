import { BaseStructure, BaseStructureProfile, BaseStructureVariant, BaseStructureVariantSetting, Pattern } from "./baseStructure.interface";
import { Box, BoxDetailMaterial, BoxInnerMaterial, BoxOuterMaterial } from "./box.interface";
import { Cut } from "./cut.interface";
import { MATERIALS, MEASUREMENT_SYSTEMS, PURITIES, SETTING_SIZES, SETTING_TYPE } from "./enums";
import { Gemstone } from "./gemStones.interface";
import { Material, MaterialPurity } from "./material.interface";
import { Profile } from "./profile.interface";
import { ClawNumber, ClawType, Setting } from "./setting.interface";
import { Size } from "./size.interface";
import { User } from "./user.interface";

export type newPattern = {
  pattern : string,
  gem: {
    id: string
    synthetic: boolean
    cut: string,
    groupNumber: number
  } []
}

export type newSetting = {
  id: string,
  clawNumber: string,
  clawType: string,
  gem: {
    id: string
    synthetic: boolean
    cut: string
  },
  pattern?: newPattern
}

export interface JewelModel {
  baseStructure: string,
  settings: string[],
  gems: string[],
}

export interface NewJewel {
  name: string;
  baseStructure: string,
  size: string,
  profile: string,
  variant: string,
  material: string,
  purity: string,
  settings: newSetting[],
  settingsSize: string,
  box: {
    shape: string,
    outerColor: string,
    innerColor: string,
    details: string
  }
  additionalTime?: number;
}

export interface JewelryCompositionSetting {
    setting?: Setting;
    gemstone?: Gemstone;
    gemstoneCut?: Cut;
    isSynthetic: boolean;
    clawNumber?: ClawNumber;
    clawType?: ClawType;
    pattern?: Pattern[];
}

export interface JewelryComposition {
    baseStructure: BaseStructure;
    size: Size;
    material: Material;
    materialPurity?: any;
    profile?: Profile;
    variant?: any;
    settingsSize?: SETTING_SIZES;
    settings?: JewelryCompositionSetting[];
}

export interface Jewelry {
    _id: string;
    name: string;
    user: User;
    creationDate: Date;
    lastEdition: Date;
    timesEdited: number;
    timeSpent: number;
    metalPrice: number;
    gemstonesPrice: number;
    taxablePrice: number;
    currentPrice: number;
    taxableHistory: number[];
    priceHistory: number[];
    shareHashWithPrice?: string;
    shareHashWithoutPrice?: string;
    timesHashRenewed: number;
    hasBeenInCart: boolean;
    snapshot?: string;
    composition: JewelryComposition;
    box?: Box;
    boxInnerColor?: BoxInnerMaterial;
    boxOuterColor?: BoxOuterMaterial;
    boxDetailColor?: BoxDetailMaterial;
}

export function newJewel(): NewJewel {
  return {
    name: "",
    baseStructure: "",
    size: "",
    profile: "",
    variant: "",
    material: "",
    purity: "",
    settingsSize: "medium",// esto está por ahora estático, luego ya no
    settings: [],
    box: {
      shape: "",
      outerColor: "",
      innerColor: "",
      details: ""
    },
    additionalTime: 0
  }
}

export function Jewelry(): Jewelry {
  // Valores “vacíos” genéricos
  const emptyUser: User = { _id: "", name: "", email: "" };
  const emptyProfile: Profile = { _id: "", name: "" };
  const emptySize: Size = { _id: "", name: "", system: MEASUREMENT_SYSTEMS.ES_IT };
  const emptyMaterialPurity: MaterialPurity = {
    _id: "",
    class: "",
    purity: PURITIES.NINE_NINE_NINE,
    pricePermm3: 0,
    allegies: false,
    composition: "",
    image: "",
    texture: ""
  };
  const emptyMaterial: Material = { _id: "", material: MATERIALS.GOLD, name: "", purities: [emptyMaterialPurity] };
  const emptySetting: Setting = {
    _id: "", name: "", type: SETTING_TYPE.PRONG, compatibleCuts: [],
    isSynthetic: false
  };
  const emptyVariantSetting: BaseStructureVariantSetting = { setting: emptySetting, gemstone: { _id: "", name: "", imagePerCut: [], texture: "", hardness: 0, hasSynthetic: false, origin: "", qualities: [] } };
  const emptyVariant: BaseStructureVariant = {
    _id: "",
    name: "",
    image: "",
    extraPrice: 0,
    modelBySize: [{ size: SETTING_SIZES.ONE_SIZE, model: "", volume: 0 }],
    settingsInfo: [
      {
        compatibleSettings: [{ setting: emptySetting, scalePerSettingSize: [{ size: SETTING_SIZES.ONE_SIZE, scale: 1 }] }],
        positionAndRotationPerSettingSize: [{
          size: SETTING_SIZES.ONE_SIZE, positionX: 0, positionY: 0, positionZ: 0, rotationX: 0, rotationY: 0, rotationZ: 0,
          rotationW: 0
        }],
        defaultsettingSize: SETTING_SIZES.ONE_SIZE,
        defaultSettings: []
      }
    ]
  };
  const emptyBaseStructureProfile: BaseStructureProfile = { _id: "", profile: emptyProfile, variants: [emptyVariant] };
  const emptyBaseStructure: BaseStructure = {
    _id: "",
    name: "",
    description: "",
    defaultDesign: {},
    profiles: []
  };

  const emptyBoxInner: BoxInnerMaterial = { _id: "", name: "", image: "", texture: "" };
  const emptyBoxOuter: BoxOuterMaterial = { _id: "", name: "", image: "", texture: "" };
  const emptyBoxDetail: BoxDetailMaterial = { _id: "", name: "", image: "" };
  const emptyBox: Box = { _id: "", name: "", model: "", image: "", innerMaterials: [emptyBoxInner], outerMaterials: [emptyBoxOuter], detailMaterials: [emptyBoxDetail] };

  const emptyGemstoneCut: Cut = {
    _id: "",
    name: "",
    description: "",
    model: "",
    width: 0,
    height: 0,
    depth: 0,
    image: ""
  }

  const emptyClawNumber: ClawNumber = {
    _id: "",
    name: ""
  }
  const emptyClawType: ClawType = {
    _id: "",
    name: "",
    cuts: [],
    model: "",
    gemPositionX: 0,
    gemPositionY: 0,
    gemPositionZ: 0,
    volume: 0,
    extraPrice: 0,
    availablePatterns: [],
  }

  const emptyJewelryCompositionSetting: JewelryCompositionSetting = { 
    setting: emptySetting,
    gemstone: emptyVariantSetting.gemstone,
    isSynthetic: false,
    gemstoneCut: emptyGemstoneCut,
    clawNumber: emptyClawNumber,
    clawType: emptyClawType
  };

  const emptyJewelryComposition: JewelryComposition = {
    baseStructure: emptyBaseStructure,
    size: emptySize,
    material: emptyMaterial,
    profile: emptyProfile,
    settings: [emptyJewelryCompositionSetting]
  };

  return {
    _id: "",
    name: "",
    user: emptyUser,
    creationDate: new Date(),
    lastEdition: new Date(),
    timesEdited: 0,
    timeSpent: 0,
    metalPrice: 0,
    gemstonesPrice: 0,
    taxablePrice: 0,
    currentPrice: 0,
    taxableHistory: [],
    priceHistory: [],
    timesHashRenewed: 0,
    hasBeenInCart: false,
    composition: emptyJewelryComposition,
    box: emptyBox,
    boxInnerColor: emptyBoxInner,
    boxOuterColor: emptyBoxOuter,
    boxDetailColor: emptyBoxDetail
  };
}
