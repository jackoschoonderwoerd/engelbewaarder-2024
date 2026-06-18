import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplyService } from './apply.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../../admin/warning/warning.component';

@Component({
    selector: 'app-apply',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInput,
        MatInputModule,
        MatCheckboxModule
    ],
    templateUrl: './apply.component.html',
    styleUrl: './apply.component.scss'
})
export class ApplyComponent {
    fb = inject(FormBuilder);
    applyService = inject(ApplyService);
    router = inject(Router)
    sb = inject(SnackbarService);
    matDialog = inject(MatDialog)

    form = this.fb.group({
        city: [''],
        email: [''],
        motivation: [''],
        name: [''],
        street_number: [''],
        street: [''],
        zipcode: [''],
        phone: [''],
        kitchen: [false],
        bar: [false],
        catering_industry_experience: [''],
        other_activities: [''],
        for_how_long: [''],
        hours_per_week: [],
        holliday_festival_plans: [''],
    });

    constructor(private snackBar: MatSnackBar) { }

    async onSubmit() {
        if (this.form.invalid) return;
        console.log(this.form.getRawValue())

        if (this.form.controls.for_how_long.value === '0') {
            this.matDialog.open(WarningComponent, {
                data: {
                    message: "'Hoeveel uren zou je minimaal willen werken?' moet groter dan 0 zijn."
                }
            })
            return;
        }

        try {
            const result = await this.applyService.send(this.form.getRawValue() as {
                city: string;
                email: string;
                motivation: string;
                name: string;
                street_number: string;
                street: string;
                zipcode: string;
                phone: string;
                kitchen: boolean;
                bar: boolean;
                catering_industry_experience: string;
                other_activities: string;
                for_how_long: string;
                hours_per_week: any;
                holliday_festival_plans: string
            });


            console.log('Function result:', result.data);

            // this.snackBar.open('Message sent successfully', 'OK', {
            //     duration: 3000,
            // });
            this.matDialog.open(WarningComponent, {
                data: {
                    message: 'Message sent successfully'
                }
            })
            this.router.navigateByUrl('/home')

            this.form.reset();
        } catch (error) {
            console.error(error);

            this.matDialog.open(WarningComponent, {
                data: {
                    message: 'Could not send message'
                }
            })
            // this.snackBar.open('Could not send message', 'OK', {
            //     duration: 3000,
            // });
        }
    }
    onCancel() {
        // console.log(this.form.dirty)
        // if (this.form.dirty) {
        //     console.log('dirty')
        //     // this.sb.openSnackbar('Als je deze pagina verlaat verlies je alle reeds ingevulde informatie')
        //     this.matDialog.open(WarningComponent, {
        //         data: {
        //             message: 'Als je deze pagina verlaat verlies je alle reeds ingevulde informatie'
        //         }
        //     })
        // }
        this.router.navigateByUrl('/home')
    }
}
