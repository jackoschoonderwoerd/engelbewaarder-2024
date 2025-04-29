import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Beer } from '../../../models/beer.model';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBottleDroplet } from '@fortawesome/free-solid-svg-icons';
import { faWineGlassEmpty } from '@fortawesome/free-solid-svg-icons';
import { UiStore } from '../../../../../services/ui.store';
import { SelectLanguageComponent } from '../../../select-language/select-language.component';

@Component({
    selector: 'app-beer-info',
    imports: [MatDialogModule, MatIconModule, FontAwesomeModule, CurrencyPipe, SelectLanguageComponent],
    templateUrl: './beer-info.component.html',
    styleUrl: './beer-info.component.scss'
})
export class BeerInfoComponent implements OnInit {

    faBottleDroplet = faBottleDroplet
    faWineGlassEmpty = faWineGlassEmpty;
    public data: any = inject(MAT_DIALOG_DATA)
    beer: Beer
    uiStore = inject(UiStore)

    ngOnInit(): void {
        this.beer = this.data.beer

    }
}
