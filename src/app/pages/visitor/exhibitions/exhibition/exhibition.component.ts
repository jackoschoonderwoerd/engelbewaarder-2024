import { Component, inject, Input } from '@angular/core';
import { Exhibition } from '../../../admin/models/exhibition.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { AuthStore } from '../../../../auth/login/auth.store';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { ExhibitionService } from '../exhibition.service';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../admin/confirm/confirm.component';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseError } from '@angular/fire/app';
import { EbImage } from '../../../admin/models/eb-image.model';
import { StorageService } from '../../../../services/storage.service';
import { WarningComponent } from '../../../admin/warning/warning.component';
import { ConfirmService } from '../../../admin/confirm/confirm.service';

@Component({
    selector: 'app-exhibition',
    imports: [FontAwesomeModule, MatIconModule, DatePipe],
    templateUrl: './exhibition.component.html',
    styleUrl: './exhibition.component.scss'
})
export class ExhibitionComponent {

    faCircleInfo = faCircleInfo
    @Input() public exhibition: Exhibition;
    authStore = inject(AuthStore)
    exhibitionService = inject(ExhibitionService);
    router = inject(Router);
    fs = inject(FirestoreService);
    dialog = inject(MatDialog);
    sb = inject(SnackbarService);
    storage = inject(StorageService);
    confirmService = inject(ConfirmService)

    onDetails(exhibition) {
        this.exhibitionService.activeExhibitionChanged.emit(exhibition);
        this.exhibitionService.activateExhibition(exhibition)
        this.router.navigate(['/exhibition-details', { exhibitionId: this.exhibition.id }])
    }

    onEdit(id: string) {
        this.router.navigate(['/add-exhibition', { id }])
    }

    onDeleteExhibition(exhibition: Exhibition) {
        console.log(exhibition);
        if (!this.isImagesArrayEmpty(exhibition)) {
            return;
        } else {
            this.confirmService.getConfirmation(exhibition.title)
                .then((res: boolean) => {
                    if (res) {
                        this.deleteExhibition(exhibition.id)
                            .then((res: any) => {
                                this.sb.openSnackbar(`exhibition ${this.exhibition.title} deleted`)
                            })
                            .catch((err: FirebaseError) => {
                                this.sb.openSnackbar(`operation failed due to: ${err.message}`)
                            })

                    } else {
                        this.sb.openSnackbar(`Operation aborted by user`)
                    }
                })
        }
    }

    private deleteExhibition(exhibitionId: string) {
        const path = `exhibitions-2024/${exhibitionId}`
        return this.fs.deleteDoc(path)
    }

    private isImagesArrayEmpty(exhibition: Exhibition) {
        if (exhibition.images.length) {
            this.dialog.open(WarningComponent, {
                data: {
                    message: `This exhibition contains images. Delete these first`
                }
            })
            return false
        } else {
            return true
        }
    }
}
