import { Component, inject, Input, OnInit } from '@angular/core';
import { Consumption } from '../../../admin/models/consumption.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UiStore } from '../../../../services/ui.store';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { AuthStore } from '../../../../auth/login/auth.store';
import { FirestoreService } from '../../../../services/firestore.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { ConfirmService } from '../../../admin/confirm/confirm.service';
import { Router } from '@angular/router';
import { ArrayService } from '../../../../services/array.service';
import { faBottleDroplet } from '@fortawesome/free-solid-svg-icons';
import { faWineGlassEmpty } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-consumption',
    imports: [
        MatButtonModule,
        MatIconModule,
        CurrencyPipe,
        FontAwesomeModule
    ],
    templateUrl: './consumption.component.html',
    styleUrl: './consumption.component.scss'
})
export class ConsumptionComponent implements OnInit {
    @Input() public consumption: Consumption;
    @Input() private index: number;
    @Input() public first: boolean;
    @Input() public last: boolean;
    @Input() private categoryId: string;
    @Input() private type: string
    uiStore = inject(UiStore);
    authStore = inject(AuthStore);
    pathToCategory: string;
    fs = inject(FirestoreService);
    sb = inject(SnackbarService);
    confirmService = inject(ConfirmService);
    router = inject(Router);
    arrayService = inject(ArrayService);
    faBottleDroplet = faBottleDroplet
    faWineGlassEmpty = faWineGlassEmpty;

    ngOnInit(): void {
        this.pathToCategory = `${this.type}-categories-2024/${this.categoryId}`
    }

    onEdit() {
        this.router.navigate([`add-consumption`, { type: this.type, categoryId: this.categoryId, index: this.index }])
    }
    onDelete() {
        console.log(this.pathToCategory)

        this.confirmService.getConfirmation(this.consumption.nameEn)
            .then((res: boolean) => {
                if (res) {
                    this.fs.removeElementFromArray(this.pathToCategory, 'consumptions', this.consumption)
                        .then((res: any) => {
                            console.log(res)
                            this.sb.openSnackbar(`element ${this.consumption.nameEn} removed`)
                        })
                        .catch((err: FirebaseError) => {
                            console.log(err);
                            this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                        })
                }
            })
            .catch((res: any) => {
                this.sb.openSnackbar(`operation aborted by user`)
            })
    }

    onMove(direction) {
        let newArray: Consumption[] = []
        this.fs.getFieldInDocument(this.pathToCategory, 'consumptions')
            .then((consumptionsArray: Consumption[]) => {
                if (direction === 'up') {
                    return newArray = this.arrayService.move(consumptionsArray, this.index, this.index - 1)
                } else if (direction === 'down') {
                    return newArray = this.arrayService.move(consumptionsArray, this.index, this.index + 1)
                }

            })
            .then((newArray: Consumption[]) => {
                return this.fs.updateField(this.pathToCategory, 'consumptions', newArray)
            })
            .then((res: any) => {
                console.log(res)
                this.sb.openSnackbar(`element moved, array updated`)
            })
            .catch((err: FirebaseError) => {
                console.log(err)
                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
            })

    }
}
