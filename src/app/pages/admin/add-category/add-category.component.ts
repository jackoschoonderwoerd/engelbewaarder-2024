import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category.model';
import { FirestoreService } from '../../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { SnackbarService } from '../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-add-category',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInput,
        MatCheckboxModule
    ],
    templateUrl: './add-category.component.html',
    styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
    form: FormGroup
    fb = inject(FormBuilder)
    editmode: boolean = false;
    type: string;
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService)
    basePath
    sb = inject(SnackbarService);
    router = inject(Router)
    categoryId: string;
    checkboxChecked: boolean = true



    ngOnInit(): void {

        this.initForm();
        this.type = this.route.snapshot.paramMap.get('type')
        this.basePath = `${this.type}-categories-2024`
        this.categoryId = this.route.snapshot.paramMap.get('categoryId')
        if (this.categoryId) {
            this.editmode = true;
            this.getCategory()
                .then((category: Category) => {
                    console.log(category)
                    this.patchForm(category)
                })
        }

    }

    initForm() {
        this.form = this.fb.group({
            nameNl: new FormControl(null, [Validators.required]),
            nameEn: new FormControl(null, [Validators.required]),
            seqNo: new FormControl(null, [Validators.required]),
            headerVisibleToVisitor: new FormControl()
        })
    }
    patchForm(category: Category) {
        this.form.patchValue({
            ...category
        })
    }
    onAddOrUpdate() {
        const formValue = this.form.value;
        const category: Category = {
            ...formValue
        }
        console.log(category)

        if (!this.editmode) {
            this.addCategory(category)
        } else {
            this.updateCategory(category)
        }

    }
    onCancel() {
        this.router.navigateByUrl(this.type)
    }

    addCategory(category: Category) {
        const path = this.basePath
        category.consumptions = []
        this.fs.addDoc(path, category)
            .then((docRef: DocumentReference) => {
                this.sb.openSnackbar(`category ${category.nameNl} added; ${docRef.id}`)
                this.router.navigateByUrl(this.type)
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to ${err.message}`)
            })
    }
    updateCategory(category) {
        const path = `${this.basePath}/${this.categoryId}`
        this.fs.updateDoc(path, category)
            .then((res: any) => {
                console.log(res)
                this.sb.openSnackbar(`category updated`)
                this.router.navigateByUrl(this.type)
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })
    }

    private getCategory() {
        const promise = new Promise((resolve, reject) => {
            const path = `${this.basePath}/${this.categoryId}`
            this.fs.getDoc(path)
                .subscribe((category: Category) => {
                    console.log(category)
                    resolve(category)
                })
        })
        return promise
    }
    private typeToBasePath(type: string) {
        if (type === 'drinks') {
            this.basePath = `drink-categories-2024`
        } else {
            this.basePath = `${type}-categories-2024`
        }
    }
    onCheckboxChange(e) {

    }
}
