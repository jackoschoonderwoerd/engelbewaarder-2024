import { Component, inject, OnInit } from '@angular/core';

import { Exhibition } from '../models/exhibition.model';

import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Observable, take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagesService, ImageData } from '../images/images.service';
import { StorageService } from '../../../services/storage.service';
import { EbImage } from '../models/eb-image.model';
import { FirestoreService } from '../../../services/firestore.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { MatDialog } from '@angular/material/dialog';
import { ImageDetailsComponent } from '../images/image-details/image-details.component';
import { AddImageComponent } from '../images/add-image/add-image.component';



interface FormValue {
    title: string;
    start: Date;
    end: Date;
    artistNames: string[];
    description: string
}


@Component({
    selector: 'app-add-exhibition',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatIconModule,
        AddImageComponent,
        ImageDetailsComponent
    ],
    templateUrl: './add-exhibition.component.html',
    styleUrl: './add-exhibition.component.scss'
})
export class AddExhibitionComponent implements OnInit {

    form: FormGroup;
    exhibition$: Observable<Exhibition>;
    exhibition: Exhibition;
    editmode: boolean = false;
    router = inject(Router);
    fb = inject(FormBuilder);

    imageFiles: File[] = [];
    imagesData: ImageData[];
    storage = inject(StorageService);
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    route = inject(ActivatedRoute);
    exhibitionId: string;
    dialog = inject(MatDialog);
    imagesService = inject(ImagesService);
    basePath = `exhibitions-2024`



    ngOnInit(): void {
        this.initForm();
        if (this.route.snapshot.paramMap.get('exhibitionId')) {
            this.exhibitionId = this.route.snapshot.paramMap.get('exhibitionId')
            this.editmode = true;
            this.getExhibition()
        }
        this.imagesService.imageArrayChanged.subscribe(() => {
            const path = `${this.basePath}/${this.exhibitionId}`
            this.fs.getDoc(path)
                .subscribe((exhibition: Exhibition) => {
                    (<FormArray>this.form.get('artistNames')).clear();
                    this.populateForm(exhibition)
                    this.exhibition = exhibition
                })
        })
    }

    getExhibition() {
        const path = `exhibitions-2024/${this.exhibitionId}`
        this.fs.getDoc(path).pipe(take(1)).subscribe((exhibition: Exhibition) => {
            this.exhibition = exhibition
            this.populateForm(exhibition)
        })
    }


    initForm() {
        this.form = this.fb.group({
            title: new FormControl(null, [Validators.required]),
            start: new FormControl(null, [Validators.required]),
            end: new FormControl(null, [Validators.required]),
            artistNames: new FormArray([]),
            description: new FormControl(null)
        })
    }
    onAddArtistName() {
        const control = new FormControl(null, [Validators.required]);
        (<FormArray>this.form.get('artistNames')).push(control);
    }

    removeName(index: number) {
        (<FormArray>this.form.get('artistNames')).removeAt(index)
    }

    onAddExhibition() {
        const formValue = this.form.value;
        formValue.artistNames = formValue.artistNames.filter(item => item !== null)
        const newOrUpdatedexhibition: Exhibition = {
            ...formValue
        }
        newOrUpdatedexhibition.images = []
        if (!this.editmode) {
            this.storeExhibition(newOrUpdatedexhibition)
                .then((docRef: DocumentReference) => {
                    console.log(docRef.id)
                    this.sb.openSnackbar(`exhibition ${newOrUpdatedexhibition.title} added`);
                    this.router.navigate(['exhibition-details', { exhibitionId: docRef.id }])
                })
                .catch((err: FirebaseError) => {
                    console.log(err)
                    this.sb.openSnackbar(`Operation failed due to: ${err.message}`)
                })
        } else {
            this.updateExhibition(newOrUpdatedexhibition)
                .then((res: any) => {
                    console.log(res)
                    this.router.navigate(['exhibition-details', { exhibitionId: this.exhibition.id }])
                    this.sb.openSnackbar(`exhibition ${newOrUpdatedexhibition.title} updated`)
                })
                .catch((err: FirebaseError) => {
                    console.log(err)
                    this.sb.openSnackbar(`Operation failed due to: ${err.message}`)
                })
        }

        return;

    }

    imageAdded() {
        console.log('imageAdded')
        this.imagesService.imageArrayChanged.emit()
    }

    private storeExhibition(exhibition: Exhibition) {
        return this.fs.addDoc(this.basePath, exhibition)
    }

    private updateExhibition(newOrUpdatedexhibition: Exhibition) {
        const path = `${this.basePath}/${this.exhibition.id}`
        return this.fs.updateDoc(path, newOrUpdatedexhibition)
    }

    onCancel(e) {
        this.form.reset();
        this.router.navigate(['/exhibitions'])
    }

    private populateForm(exhibition: Exhibition) {
        this.form.patchValue({
            ...exhibition,
            start: new Date(exhibition.start.seconds * 1000),
            end: new Date(exhibition.end.seconds * 1000)
        })
        exhibition.artistNames.forEach((name: string) => {
            const control = new FormControl(name);
            (<FormArray>this.form.get('artistNames')).push(control);
        })
    }

    storeSingleFile(path: string, file: File) {
        return this.storage.upload(path, file)
    }
}


