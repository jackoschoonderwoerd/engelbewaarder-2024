import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { UiStore } from '../../../services/ui.store';
import { CompanyStore } from '../../../services/company.store';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-banner',
    imports: [CommonModule],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.scss'
})
export class BannerComponent implements OnInit, AfterViewInit {
    uiStore = inject(UiStore);
    companyStore = inject(CompanyStore)
    randomNumber: number

    ngOnInit(): void {
        this.randomNumber = Math.floor(Math.random() * 5)
        this.getRandomNumber()
    }

    ngAfterViewInit(): void {

    }

    imageFilenamesLarge: string[] = [
        'tapoverzicht-van-verder-af-W-0-1500.jpg',
        'bar-en-achter-1280.jpg',
        'engel-bar-2-1-1280.jpg',
        'terras-boot-vanaf-cafe-1280px.jpg',
        'bar-_left_lola_1200.webp'
    ]

    getBackgroundImageSrc() {
        return this.imageFilenamesLarge[this.randomNumber];
    }


    getRandomNumber() {
        this.randomNumber = Math.floor(Math.random() * 4);
        setInterval(() => {
        }, 5000);
    }
    // getClass(){
    //     return 'firstBackground'
    // }
}
