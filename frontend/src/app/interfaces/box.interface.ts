export interface BoxDetailMaterial {
    _id: string;
    name: string;
    image: string;
    texture?: string;
}

export interface BoxInnerMaterial {
    _id: string;
    name: string;
    image: string;
    texture?: string;
}

export interface BoxOuterMaterial {
    _id: string;
    name: string;
    image: string;
    texture?: string;
}

export interface Box {
    _id: string;
    name: string;
    description?: string;
    model: string;
    image: string;
    outerMaterials: BoxOuterMaterial[];
    innerMaterials: BoxInnerMaterial[];
    detailMaterials: BoxDetailMaterial[];
}
