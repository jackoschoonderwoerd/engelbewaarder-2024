import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../../../services/storage.service';
import { WarningComponent } from '../../warning/warning.component';
import { EbImage } from '../../models/eb-image.model';
import { FirestoreService } from '../../../../services/firestore.service';

@Component({
    selector: 'app-add-image',
    imports: [],
    templateUrl: './add-image.component.html',
    styleUrl: './add-image.component.scss'
})
export class AddImageComponent implements OnInit {

    dialog = inject(MatDialog)
    storage = inject(StorageService)
    fs = inject(FirestoreService)
    // @Input() public exhibitionTitle:string;
    @Input() private storagePath: string;


    @Output() imageAdded: EventEmitter<any> = new EventEmitter<void>();

    ngOnInit(): void {
        console.log(this.storagePath)
    }

    fileInputChange(event: any) {
        const file = event.target.files[0];
        this.storage.checkForDuplicateFilenameInStorage(this.storagePath, file.name)
            .then((res: string) => {
                this.storeSingleFile(file)
                    .then((downloadUrl: string) => {
                        console.log(`file stored, ${downloadUrl}`)
                        return downloadUrl
                    })
                    .then((downloadUrl: string) => {
                        return this.addImageToArray(downloadUrl, file.name)
                    })
                    .then((res: any) => {
                        console.log(`ebImage ${file.name} added to array; ${res}`);
                        this.imageAdded.emit()
                    })
                    .catch((err: any) => {
                        console.log(`operation failed due to: ${err}`)
                    })
            })
            .catch((err: string) => {
                console.log(err);
                this.dialog.open(WarningComponent, {
                    data: {
                        message: `Operation aborted; a file with this the name<strong> ${file.name}</strong> already exists. <br> The older file will be overwritten.`
                    }
                })
            })
        return
    }

    storeSingleFile(file: File) {
        return this.storage.upload(this.storagePath, file)
    }

    private addImageToArray(downloadUrl: string, filename: string) {
        console.log(this.storagePath)
        const ebImage: EbImage = {
            filename: filename,
            filePath: downloadUrl
        }
        this.fs.addElementToArray(this.storagePath, 'images', ebImage)
    }
}
