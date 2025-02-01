import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Consumption } from '../models/consumption.model';
import { FirestoreService } from '../../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { SnackbarService } from '../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
    selector: 'app-add-consumption',
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        ReactiveFormsModule,
        MatSelectModule,
        FormsModule,
        MatCheckbox
    ],
    templateUrl: './add-consumption.component.html',
    styleUrl: './add-consumption.component.scss'
})
export class AddConsumptionComponent implements OnInit {

    form: FormGroup;
    fb = inject(FormBuilder);
    editmode: boolean = false;
    router = inject(Router)
    route = inject(ActivatedRoute)
    type: string = ''
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    categoryId: string = ''
    pathToCategory: string;
    index: number;
    vessels: string[] = ['glass', 'bottle']


    ngOnInit(): void {
        this.initForm();
        this.categoryId = this.route.snapshot.paramMap.get('categoryId')
        this.type = this.route.snapshot.paramMap.get('type');
        this.index = parseInt(this.route.snapshot.paramMap.get('index'))
        this.pathToCategory = `${this.type}-categories-2024/${this.categoryId}`

        if (this.index || this.index === 0) {
            console.log('edtmode')
            this.editmode = true
            this.setFormValue()
        }
    }

    initForm() {
        this.form = this.fb.group({
            nameNl: new FormControl(null, [Validators.required]),
            descriptionNl: new FormControl(null),
            nameEn: new FormControl(null, [Validators.required]),
            descriptionEn: new FormControl(null),
            vessel: new FormControl(null),
            availableOutside: new FormControl(true),
            price: new FormControl(null, [Validators.required]),
        })
    }

    setFormValue() {
        this.fs.getFieldInDocument(this.pathToCategory, 'consumptions').then((consumptions: Consumption[]) => {
            // this.form.setValue({
            //     ...consumptions[this.index]
            // })
            this.form.patchValue({
                nameNl: consumptions[this.index].nameNl,
                descrtiptionNl: consumptions[this.index].descriptionNl ? consumptions[this.index].descriptionNl : null,
                nameEn: consumptions[this.index].nameEn,
                descrtiptionE: consumptions[this.index].descriptionEn ? consumptions[this.index].descriptionEn : null,
                vessel: consumptions[this.index].vessel ? consumptions[this.index].vessel : null,
                availableOutside: consumptions[this.index].availableOutside ? consumptions[this.index].availableOutside : null,
                price: consumptions[this.index].price

            })
        })
    }


    onSubmit() {
        const consumption: Consumption = {
            ...this.form.value
        }
        console.log(consumption);
        if (!this.editmode) {
            this.addConsumption(consumption)

        } else {
            this.updateConsumption(consumption)
        }
    }
    onCancel() {
        console.log('cancel')
        this.router.navigateByUrl(this.type);
    }

    addConsumption(consumption) {
        console.log(this.type)
        // return
        const path = `${this.type}-categories-2024/${this.categoryId}`
        console.log(this.pathToCategory)
        this.fs.addElementToArray(path, 'consumptions', consumption)
            .then((res: any) => {
                console.log(res)
                this.sb.openSnackbar(`element added to array`)
                this.router.navigateByUrl(`/${this.type}`);
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
        return
        this.fs.addDoc(path, consumption)
            .then((docRef: DocumentReference) => {
                this.sb.openSnackbar(`${this.type} ${consumption.nameNl} added with id: ${docRef.id}`)
                this.router.navigateByUrl('dinner');
            })
            .catch((err: FirebaseError) => {
                this.sb.openSnackbar(`operation failed due to: ${err.message}`);
            })
    }
    updateConsumption(consumption) {
        this.fs.getFieldInDocument(this.pathToCategory, 'consumptions')
            .then((consumptions: Consumption[]) => {
                consumptions[this.index] = consumption;
                return consumptions
            })
            .then((consumptions: Consumption[]) => {
                return this.fs.updateField(this.pathToCategory, 'consumptions', consumptions)
            })
            .then((res: any) => {
                console.log(res)
                this.sb.openSnackbar(`consumptions array updated`)
                this.router.navigateByUrl(this.type)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }
}
