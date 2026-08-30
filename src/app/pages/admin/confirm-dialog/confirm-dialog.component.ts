import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatDialogModule, MatIconModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
    public data: any = inject(MAT_DIALOG_DATA)
}
