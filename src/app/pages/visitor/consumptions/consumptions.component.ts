import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Consumption } from '../../admin/models/consumption.model';
import { FirestoreService } from '../../../services/firestore.service';
import { Category } from '../../admin/models/category.model';
import { JsonPipe } from '@angular/common';
import { UiStore } from '../../../services/ui.store';
import { ConsumptionComponent } from './consumption/consumption.component';
import { AuthStore } from '../../../auth/login/auth.store';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../../admin/warning/warning.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { ConfirmComponent } from '../../admin/confirm/confirm.component';

@Component({
    selector: 'app-consumptions',
    imports: [MatButtonModule, ConsumptionComponent, MatIconModule],
    templateUrl: './consumptions.component.html',
    styleUrl: './consumptions.component.scss'
})
export class ConsumptionsComponent implements OnInit {

    route = inject(ActivatedRoute)
    router = inject(Router)
    basePath: string;
    type: string;
    // consumptions:Consumption[];
    fs = inject(FirestoreService);
    categories: Category[];
    uiStore = inject(UiStore);
    authStore = inject(AuthStore);
    dialog = inject(MatDialog);
    sb = inject(SnackbarService)


    ngOnInit(): void {


        this.type = (this.router.url).substring(1)
        this.basePath = `${this.type}-categories-2024`
        this.fs.sortedCollection(this.basePath, `seqNo`, 'asc').subscribe((categories: Category[]) => {
            this.categories = categories
        })

    }
    onEditCategory(categoryId) {
        this.router.navigate(['add-category', { type: this.type, categoryId }]);
    }
    onDeleteCategory(categoryId: string) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: categoryId
            }
        })
        dialogRef.afterClosed().subscribe((status: boolean) => {
            if (status) {
                const path = `${this.basePath}/${categoryId}`
                this.fs.getFieldInDocument(path, 'consumptions')
                    .then((consumptionsArray: Consumption[]) => {
                        if (consumptionsArray.length) {
                            this.dialog.open(WarningComponent, {
                                data: {
                                    message: `array not empty`
                                }
                            })
                        } else {
                            const path = `${this.basePath}/${categoryId}`
                            this.fs.deleteDoc(path)
                                .then((res: any) => {
                                    console.log(res);
                                    this.sb.openSnackbar(`category deleted`)
                                })
                                .catch((err: FirebaseError) => {
                                    console.log(err)
                                    this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                                })
                        }
                    })

            } else {
                this.sb.openSnackbar(`operation aborted by user`);
            }
        })
    }


    onAddCategory() {
        this.router.navigate(['add-category', { type: this.type }]);
    }
    onAddConsumption(categoryId: string) {
        console.log(categoryId);
        this.router.navigate(['add-consumption', { type: this.type, categoryId }]);
    }

}
