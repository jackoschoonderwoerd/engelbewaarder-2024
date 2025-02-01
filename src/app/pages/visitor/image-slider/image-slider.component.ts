import { AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { ExhibitionService } from '../exhibitions/exhibition.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Exhibition } from '../../admin/models/exhibition.model';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { UiStore } from '../../../services/ui.store';
import { MatButtonModule } from '@angular/material/button';

interface ImageDimensions {
    imageWidth: number;
    imageHeight: number
}

@Component({
    selector: 'app-image-slider',
    imports: [MatIconModule, MatButtonModule],
    templateUrl: './image-slider.component.html',
    styleUrl: './image-slider.component.scss'
})
export class ImageSliderComponent implements OnInit, OnDestroy {
    @Input() public sentBy: string

    exhibitionService = inject(ExhibitionService);
    router = inject(Router);
    sb = inject(SnackbarService)
    windowHeight: number;
    windowWidth: number;
    images: any[] = [];
    index: number = 0;
    exhibition: Exhibition;
    from: string
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService)
    arrayLength: number;
    uiStore = inject(UiStore);
    private swipeCoord?: [number, number];
    private swipeTime?: number;
    @ViewChild('indicator') public indicator: HTMLElement


    ngOnInit(): void {
        this.from = this.route.snapshot.paramMap.get('from');

        this.uiStore.setImageSliderActive(true)
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.exhibitionService.exhibition$.subscribe((exhibition: Exhibition) => {
            if (exhibition && exhibition.images.length > 0) {
                console.log(exhibition.images);

                this.exhibition = exhibition
                this.images = exhibition.images;
                this.arrayLength = exhibition.images.length;
            } else {
                this.router.navigateByUrl('exhibitions')
                this.sb.openSnackbar(`No exhibition and / or images found; redirected`);
            }
        })
        window.addEventListener('resize', this.getWindowWidth);
        window.addEventListener('resize', this.getWindowHeight);
        window.addEventListener('orientationchange', this.getWindowHeight);
        window.addEventListener('orientationchange', this.getWindowWidth);
    }

    getWindowWidth() {
        // console.log(`Current window width: ${window.innerWidth}`);
        return (window.innerWidth).toString() + 'px'
    }


    getWindowHeight() {
        // console.log(`Current window height: ${window.innerHeight}`);
        return (window.innerHeight).toString() + 'px';
    }

    updateIndex(direction: string) {

        if (direction === 'next') {
            if (this.index < this.arrayLength - 1) {

                this.index = this.index + 1
            } else {
                this.index = 0
            }
        } else if (direction === 'previous') {
            if (this.index === 0) {
                this.index = this.arrayLength - 1
            } else {
                this.index = this.index - 1
            }
        }

    }

    onHome() {
        console.log(this.from)
        if (this.from === 'exhibition-info') {
            this.router.navigateByUrl('/exhibitions');
        } else {
            this.router.navigateByUrl('/home')
        }
    }

    ngOnDestroy(): void {
        this.uiStore.setImageSliderActive(false);
        this.from = '';
    }

    swipe(e: TouchEvent, when: string): void {

        const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            if (duration < 1000 //
                && Math.abs(direction[0]) > 30 // Long enough
                && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
                const swipe = direction[0] < 0 ? 'next' : 'previous';
                // Do whatever you want with swipe
                if (swipe === 'next') {
                    this.updateIndex('next')
                } else if (swipe === 'previous') {
                    this.updateIndex('previous')
                }
            }
        }
    }


}
