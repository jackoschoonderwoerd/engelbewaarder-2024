import { EventEmitter, inject, Injectable } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Beer } from '../models/beer.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
interface BeerAndIndex {
    beer: Beer,
    index: number
}

@Injectable({
    providedIn: 'root'
})
export class BeersService {

    constructor() { }




    editBeer = new EventEmitter<Beer>


}
