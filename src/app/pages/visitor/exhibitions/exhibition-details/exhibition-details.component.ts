import { Component, inject, OnInit } from '@angular/core';
import { ExhibitionService } from '../exhibition.service';
import { Exhibition } from '../../../admin/models/exhibition.model';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar.service';
import { AuthStore } from '../../../../auth/login/auth.store';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmService } from '../../../admin/confirm/confirm.service';

@Component({
    selector: 'app-exhibition-details',
    imports: [DatePipe, MatIconModule, MatButtonModule],
    templateUrl: './exhibition-details.component.html',
    styleUrl: './exhibition-details.component.scss'
})
export class ExhibitionDetailsComponent implements OnInit {
    exhibitionService = inject(ExhibitionService)
    exhibition: Exhibition;
    router = inject(Router);
    sb = inject(SnackbarService)
    authStore = inject(AuthStore);
    route = inject(ActivatedRoute);
    fs = inject(FirestoreService);
    basePath = 'exhibitions-2024';
    cf = inject(ConfirmService)

    ngOnInit(): void {
        const exhibitionId = this.route.snapshot.paramMap.get('exhibitionId')
        // console.log(exhibitionId)
        if (exhibitionId) {
            const path = `${this.basePath}/${exhibitionId}`
            this.fs.getDoc(path)
                .subscribe((exhibition: Exhibition) => {
                    this.exhibition = exhibition;
                })
        }
        // this.exhibitionService.exhibition$.subscribe((exhibition: Exhibition) => {
        //     if (!exhibition) {
        //         this.sb.openSnackbar(`No active exhibition found, you are being redirected`)
        //         this.router.navigateByUrl('/exhibitions')
        //     } else {

        //         console.log(exhibition)
        //     }
        // })
    }

    onDeleteExhibition(exhibitionId: string) {
        this.cf.getConfirmation(exhibitionId).then((res: boolean) => {
            if (res) {
                const path = `${this.basePath}/${exhibitionId}`
                this.fs.deleteDoc(path)
                    .then((res: any) => {
                        this.router.navigateByUrl('exhibitions')
                        this.sb.openSnackbar(`exhibition ${exhibitionId} deleted`)
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err)
                        this.sb.openSnackbar(`Operation failed due to: ${err.message}`)
                    })
            } else {
                this.sb.openSnackbar(`Operation aborted by user`);
            }
        })

    }
    onEditExhibition(exhibitionId: string) {
        console.log(exhibitionId)
        this.router.navigate(['add-exhibition', { exhibitionId }])
    }

    onCamera() {
        this.router.navigate(['/image-slider', { from: 'exhibition-info' }]);
    }
}
