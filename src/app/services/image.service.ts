import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ImageDownloadUrlFilename } from '../pages/admin/models/image_downloadUrl_filename.model';

@Injectable({
    providedIn: 'root'
})

export class ImageService {

    storage = inject(StorageService)

    storeImageFiles(exhibitionTitle: string, imageFiles: File[]): Promise<unknown> {
        const promise = new Promise((resolve, reject) => {
            this.storage.uploadMultipleFiles(`exhibitions-2024/${exhibitionTitle}`, imageFiles).then((downloadsUrlFilename: ImageDownloadUrlFilename[]) => {
                resolve(downloadsUrlFilename)
            })
        })
        return promise
    }
}
