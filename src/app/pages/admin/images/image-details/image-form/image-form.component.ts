import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EbImage } from '../../../models/eb-image.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FirestoreService } from '../../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { Exhibition } from '../../../models/exhibition.model';
import { SnackbarService } from '../../../../../services/snackbar.service';

interface FormValue {
    title: string;
    artistName: string;
    copyrightOwner: string;
    price: number
}

@Component({
    selector: 'app-image-form',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInput],
    templateUrl: './image-form.component.html',
    styleUrl: './image-form.component.scss'
})
export class ImageFormComponent implements OnInit {

    data = inject(MAT_DIALOG_DATA)
    form: FormGroup;
    fb = inject(FormBuilder)
    ebImage: EbImage;
    index: number;
    exhibitionId: string;
    fs = inject(FirestoreService)
    dialogRef = inject(MatDialogRef<ImageFormComponent>)
    sb = inject(SnackbarService)



    // constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
    ngOnInit(): void {
        this.ebImage = this.data.ebImage
        this.exhibitionId = this.data.exhibitionId;
        this.index = this.data.index;
        console.log(this.index, this.exhibitionId)
        this.initForm()
    }
    initForm() {
        this.form = this.fb.group({
            title: new FormControl(this.ebImage.title ? this.ebImage.title : ''),
            artistName: new FormControl(this.ebImage.artistName ? this.ebImage.artistName : ''),
            copyrightOwner: new FormControl(this.ebImage.copyrightOwner ? this.ebImage.copyrightOwner : ''),
            price: new FormControl(this.ebImage.price ? this.ebImage.price : '')
        })
    }

    onSubmit() {
        const formValue: FormValue = this.form.value;
        const ebImage = this.ebImage;
        ebImage.title = formValue.title
        ebImage.artistName = formValue.artistName;
        ebImage.copyrightOwner = formValue.copyrightOwner
        ebImage.price = formValue.price
        console.log(ebImage)
        const path = `exhibitions-2024/${this.exhibitionId}`
        this.fs.getFieldInDocument(path, 'images').then((imageArray: EbImage[]) => {
            console.log(imageArray)
            imageArray[this.index] = ebImage
            this.updateImageField(imageArray)
        })


    }

    onClearForm() {

    }
    onCancel() {
        this.dialogRef.close()
    }
    private updateImageField(ebImages: EbImage[]) {
        const path = `exhibitions-2024/${this.exhibitionId}`
        this.fs.updateField(path, 'images', ebImages)
            .then((res: any) => {
                console.log(res);
                this.sb.openSnackbar(`images updated`)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to : ${err.message}`)
            })
    }
}
