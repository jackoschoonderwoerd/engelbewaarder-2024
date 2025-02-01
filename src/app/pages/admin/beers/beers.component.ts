import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../services/snackbar.service';
import { UiStore } from '../../../services/ui.store';
import { AddBeerComponent } from './add-beer/add-beer.component';
import { Beer } from '../models/beer.model';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { BeerDetailsComponent } from './beer-details/beer-details.component';
import { BeersService } from './beers.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthStore } from '../../../auth/login/auth.store';

@Component({
    selector: 'app-beers',
    imports: [
        MatIconModule,
        BeerDetailsComponent
    ],
    templateUrl: './beers.component.html',
    styleUrl: './beers.component.scss'
})
export class BeersComponent implements OnInit {

    fs = inject(FirestoreService);
    sb = inject(SnackbarService)
    ui = inject(UiStore);
    router = inject(Router)
    beers: Beer[] = [];
    authStore = inject(AuthStore)

    beersService = inject(BeersService)


    ngOnInit(): void {
        this.loadBeers()
    }
    loadBeers() {
        const path = `beers`;
        this.fs.sortedCollection(path, 'seqNo', 'asc').subscribe((beers: Beer[]) => {
            this.beers = beers;
        });
    }

    onAddBeer() {
        this.router.navigateByUrl('add-beer');
    }
}

