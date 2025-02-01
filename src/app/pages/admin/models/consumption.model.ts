import { Vessel } from "./beer.model";


export interface Consumption {
    nameNl: string;
    descriptionNl?: string;
    nameEn: string;
    descriptionEn?: string;
    price: number;
    vessel?: string;
    clVolume?: number;
    alcoholPercentage?: number;
    availableOutside: boolean;
}


