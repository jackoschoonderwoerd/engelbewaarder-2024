
import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UpdateService {
    private swUpdate = inject(SwUpdate);
    private snackBar = inject(MatSnackBar);

    constructor() {
        console.log('updateservice called')
        if (!this.swUpdate.isEnabled) {
            return;
        }

        this.swUpdate.versionUpdates
            .pipe(
                filter(
                    (event): event is VersionReadyEvent =>
                        event.type === 'VERSION_READY'
                )
            )
            .subscribe(() => {
                const snack = this.snackBar.open(
                    'Er is een nieuwe versie beschikbaar.',
                    'VERNIEUWEN',
                    {
                        duration: 0
                    }
                );

                snack.onAction().subscribe(() => {
                    document.location.reload();
                });
            });
    }
}
