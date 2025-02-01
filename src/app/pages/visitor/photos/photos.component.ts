import { Component, inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../services/firestore.service';
import { Exhibition } from '../../admin/models/exhibition.model';
import { ExhibitionService } from '../exhibitions/exhibition.service';
import { AuthStore } from '../../../auth/login/auth.store';

@Component({
    selector: 'app-photos',
    imports: [MatButtonModule],
    templateUrl: './photos.component.html',
    styleUrl: './photos.component.scss'
})
export class PhotosComponent implements OnInit {

    fs = inject(FirestoreService)
    exhibitionService = inject(ExhibitionService)
    router = inject(Router)
    authStore = inject(AuthStore)

    ngOnInit(): void {
        // if (!this.authStore.isLoggedIn()) {
        const path = `exhibitions-2024`
        this.fs.findDoc(path, 'title', 'photos engelbewaarder')
            .subscribe((exhibitionArray: Exhibition[]) => {
                const exhibition = exhibitionArray[0]
                console.log(exhibition)
                this.exhibitionService.activateExhibition(exhibition)
                this.router.navigateByUrl('image-slider');

            })
        // } else {
        // this.router.navigateByUrl(`/admin-photos`);
        // }
    }
}
