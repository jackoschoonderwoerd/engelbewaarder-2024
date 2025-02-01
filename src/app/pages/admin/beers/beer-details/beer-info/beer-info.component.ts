import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Beer } from '../../../models/beer.model';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBottleDroplet } from '@fortawesome/free-solid-svg-icons';
import { faWineGlassEmpty } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-beer-info',
    imports: [MatDialogModule, MatIconModule, FontAwesomeModule, CurrencyPipe],
    templateUrl: './beer-info.component.html',
    styleUrl: './beer-info.component.scss'
})
export class BeerInfoComponent implements OnInit {

    faBottleDroplet = faBottleDroplet
    faWineGlassEmpty = faWineGlassEmpty;
    public data: any = inject(MAT_DIALOG_DATA)
    beer: Beer

    ngOnInit(): void {
        this.beer = this.data.beer

    }
}
