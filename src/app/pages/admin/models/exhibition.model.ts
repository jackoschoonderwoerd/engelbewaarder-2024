import { EbImage } from "./eb-image.model";



export interface Exhibition {
    id?: string;
    title: string;
    start: any;
    end: any;
    images: EbImage[];
    artistNames: string[];
    description: string;
}
