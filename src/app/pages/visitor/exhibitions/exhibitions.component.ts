import { Component, inject, OnInit } from '@angular/core';
import { Exhibition } from '../../admin/models/exhibition.model';
import { FirestoreService } from '../../../services/firestore.service';
import { SnackbarService } from '../../../services/snackbar.service';

import { ExhibitionComponent } from './exhibition/exhibition.component';
import { AddExhibitionComponent } from '../../admin/add-exhibition/add-exhibition.component';
import { Router } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { UiStore } from '../../../services/ui.store';
import { AuthStore } from '../../../auth/login/auth.store';

@Component({
    selector: 'app-exhibitions',
    imports: [ExhibitionComponent, MatButtonModule],
    templateUrl: './exhibitions.component.html',
    styleUrl: './exhibitions.component.scss'
})
export class ExhibitionsComponent implements OnInit {

    exhibitions: Exhibition[]
    fs = inject(FirestoreService)
    sb = inject(SnackbarService);
    router = inject(Router);
    authStore = inject(AuthStore)

    ngOnInit(): void {
        const path = `exhibitions-2024`
        this.fs.sortedCollection(path, 'start', 'desc').subscribe((exhibitions: Exhibition[]) => {
            if (exhibitions) {
                this.exhibitions = exhibitions
            } else {
                this.sb.openSnackbar(`operation failed`)
            }
        })
    }
    onAddExhibition() {
        this.router.navigateByUrl('/add-exhibition');
    }

}
