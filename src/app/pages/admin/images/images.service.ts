import { EventEmitter, Injectable, Output } from '@angular/core';
import { ImageDownloadUrlFilename } from '../models/image_downloadUrl_filename.model';

export interface ImageData {
    file: File;
    filename: string;
    base64string: string;
}

@Injectable({
    providedIn: 'root'
})
export class ImagesService {

    @Output() imagesFilesChanged = new EventEmitter<File[]>
    @Output() imageArrayChanged = new EventEmitter<void>
    constructor() { }

}
