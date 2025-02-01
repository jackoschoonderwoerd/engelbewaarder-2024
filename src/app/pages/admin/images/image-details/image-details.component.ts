import { Component, inject, Input, OnInit } from '@angular/core';
import { EbImage } from '../../models/eb-image.model';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { StorageService } from '../../../../services/storage.service';
import { FirestoreService } from '../../../../services/firestore.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { ImageFormComponent } from './image-form/image-form.component';
import { ArrayService } from '../../../../services/array.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ImagesService } from '../images.service';

@Component({
    selector: 'app-image-details',
    imports: [
        MatIconModule,
        CurrencyPipe,
        MatButtonModule
    ],
    templateUrl: './image-details.component.html',
    styleUrl: './image-details.component.scss'
})
export class ImageDetailsComponent {
    @Input() public ebImage: EbImage;
    @Input() public exhibitionTitle: string;
    @Input() public exhibitionId: string;
    @Input() private index: number;

    dialog = inject(MatDialog);
    storage = inject(StorageService)
    fs = inject(FirestoreService);
    sb = inject(SnackbarService)
    as = inject(ArrayService);
    router = inject(Router)
    imagesService = inject(ImagesService)

    onDeleteImage() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: this.ebImage.filename
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                const path = `exhibitions-2024/${this.exhibitionId}/${this.ebImage.filename}`
                this.storage.deleteFile(path)
                    .then((res: any) => {
                        console.log(`${this.ebImage.filename} removed from storage`);
                        const path = `exhibitions-2024/${this.exhibitionId}`
                        this.fs.removeElementFromArray(`exhibitions-2024/${this.exhibitionId}`, 'images', this.ebImage)
                            .then((res: any) => {
                                this.sb.openSnackbar(`${this.ebImage.filename} removed from firestore`)
                                this.imagesService.imageArrayChanged.emit()
                            })
                            .catch((err: FirebaseError) => {
                                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                            })
                    })
                    .catch((err: RangeError) => {
                        this.sb.openSnackbar(`operation failed due to: ${RangeError}`)
                    })
            } else {
                this.sb.openSnackbar(`operation aborted by user`);
            }
        })
    }

    onEditImage() {
        this.dialog.open(ImageFormComponent, {
            data: {
                exhibitionId: this.exhibitionId,
                index: this.index,
                ebImage: this.ebImage
            }
        })
    }
    onMove(direction) {
        let toIndex: number = 0;
        let formIndex: number = this.index
        if (direction === 'up') {
            toIndex = this.index - 1
        } else if (direction === 'down') {
            toIndex = this.index + 1
        }
        const path = `exhibitions-2024/${this.exhibitionId}`
        this.fs.getFieldInDocument(path, 'images').then((ebImages: EbImage[]) => {

            const updatedArray = this.as.move(ebImages, formIndex, toIndex)
            return (updatedArray);
        })
            .then((updatedArray: EbImage[]) => {
                return this.fs.updateField(path, 'images', updatedArray)
            })
            .then((res: any) => {
                this.sb.openSnackbar(`array updated`)
                this.imagesService.imageArrayChanged.emit()

            })
            .catch((err: FirebaseError) => {
                console.log(err.message)
                this.sb.openSnackbar(`failed to update array due to ${err.message}`)
            })
    }
}
