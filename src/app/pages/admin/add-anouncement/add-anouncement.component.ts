import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnouncementService } from './anouncement.service';
import { take } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { AunouncementDialogComponent } from '../../visitor/aunouncement-dialog/aunouncement-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../../services/snackbar.service';
import { PreviewHtmlComponent } from './preview-html/preview-html.component';

export interface Anouncement {
    anouncementNl: string;
    anouncementEn: string;
    startDate: Date | any;
    endDate: Date | any;

}

@Component({
    selector: 'app-add-anouncement',
    imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatInput, MatButtonModule,
        PreviewHtmlComponent],
    templateUrl: './add-anouncement.component.html',
    styleUrl: './add-anouncement.component.scss',
    providers: [provideNativeDateAdapter()],

})
export class AddAnouncementComponent {
    anouncementStatus: boolean;
    form: FormGroup;
    rows: number = 15;
    mytext: string;
    anouncementNl: string;
    anouncementEn: string;
    anouncementService = inject(AnouncementService)
    fb = inject(FormBuilder);
    dialog = inject(Dialog);
    sb = inject(SnackbarService)


    ngOnInit(): void {
        this.initForm()
        this.anouncementService.getAnouncement().then((anouncement: Anouncement) => {
            this.anouncementNl = anouncement.anouncementNl;
            this.anouncementEn = anouncement.anouncementEn;
            this.patchForm(anouncement)
        })
    }

    initForm() {
        this.form = this.fb.group({
            anouncementNl: new FormControl(null),
            anouncementEn: new FormControl(null),
            startDate: new FormControl(null),
            endDate: new FormControl(null)
        })
    }
    patchForm(formData) {
        this.form.patchValue({
            anouncementNl: formData.anouncementNl,
            anouncementEn: formData.anouncementEn,
            startDate: new Date(formData.startDate.seconds * 1000),
            endDate: new Date(formData.endDate.seconds * 1000)
        })
    }

    anouncementNlChanged() {
        this.anouncementNl = this.form.value.anouncementNl
    }

    anouncementEnChanged($event) {
        this.anouncementEn = this.form.value.anouncementEn
    }

    englishAnouncementChange() {
        this.anouncementEn = this.form.value.anouncementEn
    }

    submit() {
        const formValue = this.form.value;
        const anouncement: Anouncement = {
            anouncementNl: formValue.anouncementNl,
            anouncementEn: formValue.anouncementEn,
            startDate: formValue.startDate,
            endDate: formValue.endDate
        }
        this.anouncementService.setAnouncement(anouncement).then((res: any) => {
            console.log(res)
            this.sb.openSnackbar(`anouncement stored`)
        })
    }

    previewDialog() {
        this.anouncementService.getAnouncementsArray().pipe(take(1)).subscribe((anouncementsArray: any) => {
            const anouncement: Anouncement = anouncementsArray[0]
            this.dialog.open(AunouncementDialogComponent, {
                panelClass: 'full-screen',
                maxWidth: '300px',
                maxHeight: '90vh',
                data: { anouncement }
            });
        })
    }
    cancel() {

    }
}
