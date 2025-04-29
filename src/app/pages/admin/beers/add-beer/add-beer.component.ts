import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Beer, Vessel } from '../../models/beer.model';
import { FirestoreService } from '../../../../services/firestore.service';
import { BeersService } from '../beers.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';


@Component({
    selector: 'app-add-beer',
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        ReactiveFormsModule,
        MatSelectModule,
        FormsModule,

    ],
    templateUrl: './add-beer.component.html',
    styleUrl: './add-beer.component.scss'
})
export class AddBeerComponent implements OnInit {
    form: FormGroup
    fb = inject(FormBuilder)
    fs = inject(FirestoreService)
    sb = inject(SnackbarService);
    router = inject(Router);
    route = inject(ActivatedRoute)
    beersService = inject(BeersService)
    vessels: string[] = ['glass', 'bottle'];
    editmode: boolean = false;







    ngOnInit(): void {
        this.initForm();
        if (this.route.snapshot.paramMap.get('id')) {
            const id = this.route.snapshot.paramMap.get('id')
            this.editmode = true;
            const path = `beers/${id}`
            this.fs.getDoc(path)
                .subscribe((beer: Beer) => {
                    this.patchForm(beer);
                })
        }
    }
    initForm() {
        this.form = this.fb.group({
            id: new FormControl(null, [Validators.required]),
            seqNo: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required]),
            nameNl: new FormControl(null, [Validators.required]),
            nameEn: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            descriptionNl: new FormControl(null, [Validators.required]),
            descriptionEn: new FormControl(null, [Validators.required]),
            vessel: new FormControl(null, [Validators.required]),
            clVolume: new FormControl(null, [Validators.required]),
            alcoholPercentage: new FormControl(null, [Validators.required]),
            price: new FormControl(null, [Validators.required]),
        })
    }

    patchForm(beer: Beer) {
        this.form.patchValue({
            ...beer
        })
    }

    onSubmit() {
        const beer: Beer = this.form.value;
        if (this.editmode) {
            const path = `beers/${beer.id}`;
            this.fs.setDoc(path, beer)
                .then((res: any) => {
                    this.sb.openSnackbar('beer updated')
                    this.router.navigateByUrl('/beers')
                })
        } else {
            const path = `beers`;
            this.fs.addDoc(path, beer)
                .then((docRef: DocumentReference) => {
                    this.sb.openSnackbar(`beer added`);
                    this.router.navigateByUrl('/beers')
                })
        }
    }

    onCancel() {
        this.form.reset();
        this.router.navigateByUrl('/beers');
    }
}
