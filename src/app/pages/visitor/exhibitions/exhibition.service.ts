import { EventEmitter, Injectable } from '@angular/core';
import { Exhibition } from '../../admin/models/exhibition.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExhibitionService {

    private exhibitionSubject = new BehaviorSubject<Exhibition>(null)
    exhibition$: Observable<Exhibition> = this.exhibitionSubject.asObservable()
    activeExhibitionChanged = new EventEmitter<Exhibition>;

    constructor() { }

    activateExhibition(exhibition: Exhibition) {
        this.exhibitionSubject.next(exhibition)
    }


}
