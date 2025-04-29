import { Consumption } from "./consumption.model";

export interface Vessel {
    shape: 'glass' | 'bottle'
}

export interface Beer {
    id?: string;
    seqNo: number;
    name: string;
    nameNl?: string;
    nameEn?: string;
    description: string;
    descriptionNl: string;
    descriptionEn: string;
    vessel: string;
    clVolume: number;
    alcoholPercentage: string;
    price: number;
}
