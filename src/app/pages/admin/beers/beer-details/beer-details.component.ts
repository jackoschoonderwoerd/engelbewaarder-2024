// https://github.com/FortAwesome/angular-fontawesome
// https://www.npmjs.com/package/@fortawesome/angular-fontawesome
// https://fontawesome.com/search?q=bottle&o=r

import { Component, inject, Input, OnInit } from '@angular/core';
import { Beer } from '../../models/beer.model';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBottleDroplet } from '@fortawesome/free-solid-svg-icons';
import { faWineGlassEmpty } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { AuthStore } from '../../../../auth/login/auth.store';
import { MatDialog } from '@angular/material/dialog';
import { BeerInfoComponent } from './beer-info/beer-info.component';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { SelectLanguageComponent } from '../../select-language/select-language.component';


@Component({
    selector: 'app-beer-details',
    imports: [
        MatIconModule,
        CurrencyPipe,
        FontAwesomeModule,

    ],
    templateUrl: './beer-details.component.html',
    styleUrl: './beer-details.component.scss'
})
export class BeerDetailsComponent implements OnInit {
    @Input() beer: Beer;


    faBottleDroplet = faBottleDroplet
    faWineGlassEmpty = faWineGlassEmpty;
    faCircleInfo = faCircleInfo
    // beersService = inject(BeersService);
    sb = inject(SnackbarService)
    router = inject(Router);
    fs = inject(FirestoreService)
    authStore = inject(AuthStore);
    dialog = inject(MatDialog)

    ngOnInit(): void {
        // console.log(this.beer, this.first, this.last)
    }

    onInfo() {
        this.dialog.open(BeerInfoComponent, {
            data: { beer: this.beer }
        })
    }

    onDelete() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                doomedElement: this.beer.name
            }
        })
        dialogRef.afterClosed().subscribe((status: boolean) => {
            if (status) {
                const path = `beers/${this.beer.id}`
                this.fs.deleteDoc(path)
                    .then((res: any) => {
                        this.sb.openSnackbar(`beer deleted`);
                    })
                    .catch((err: FirebaseError) => {
                        this.sb.openSnackbar(`operatio failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar('Operation aborted by user.')
            }
        })
    }
    onEdit() {
        this.router.navigate(['add-beer', { id: this.beer.id }])
    }

}
