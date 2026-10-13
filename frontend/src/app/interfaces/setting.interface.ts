import { Cut } from "./cut.interface";
import { SETTING_TYPE } from "./enums";

export interface PatternGemstone {
  gemPositionX: number;
  gemPositionY: number;
  gemPositionZ: number;
  scaleFactor: number;
  groupNumber: number; 
}

export interface AvailablePattern {
  _id: string;
  patternName: string;
  patternImage: string;
  numberOfGroups: number;
  gemstones: PatternGemstone[]; // Array plano de gemas
}

export interface ClawType {
  _id: string;
  name: string;
  cuts: { 
    cut: Cut; 
    imagePerGem?: {
      image: string;
    }[];
   }[];
  model: string;
  gemPositionX: number;
  gemPositionY: number;
  gemPositionZ: number;
  volume: number;
  extraPrice: number;
  availablePatterns?: AvailablePattern[]; 
}

export interface ClawNumber {
  _id: string;
  name: string;
  compatibleCuts?: {
    cut: string;
    imagePerGem?: {
      image: string;
    }[];
    clawType?: ClawType[];
  }[];
}

export interface Setting {
  isSynthetic: boolean;
  _id: string;
  name: string;
  type: SETTING_TYPE;
  compatibleCuts?: { 
    cut: Cut; 
    imagePerGem?: {
      image: string;
    }[];
  }[];
  clawNumber?: ClawNumber[];
}
