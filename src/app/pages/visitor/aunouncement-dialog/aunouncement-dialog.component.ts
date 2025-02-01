import { JsonPipe } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { matFormFieldAnimations, MatFormFieldModule } from '@angular/material/form-field';
import { AnouncementService } from '../../admin/add-anouncement/anouncement.service';
import { Anouncement } from '../../admin/add-anouncement/add-anouncement.component';
import { MatIconModule } from '@angular/material/icon';
import { UiStore } from '../../../services/ui.store';
import { SelectLanguageComponent } from '../../admin/select-language/select-language.component';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-aunouncement-dialog',
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        SelectLanguageComponent
    ],
    templateUrl: './aunouncement-dialog.component.html',
    styleUrl: './aunouncement-dialog.component.scss',
    // providers: [
    //     {
    //         provide: MatDialogRef,
    //         useValue: {}
    //     },

    // ],
})
export class AunouncementDialogComponent implements OnInit {



    anouncementService = inject(AnouncementService)
    anouncement: Anouncement
    uiStore = inject(UiStore)
    sb: SnackbarService

    ngOnInit(): void {
        this.anouncementService.getAnouncement()
            .then((anouncement: Anouncement) => {
                this.anouncement = anouncement
            })
            .catch((err: any) => {
                this.sb.openSnackbar('not available')
            })
    }
}
