import { inject, Injectable } from '@angular/core';
import {
    Firestore,
    addDoc,
    collection,
    collectionData,
    collectionGroup,
    doc,
    docData,
    deleteDoc,
    updateDoc,
    DocumentReference,
    setDoc,
    orderBy,
    query,
    Timestamp
} from '@angular/fire/firestore';
import { Anouncement } from './add-anouncement.component';
import { FirestoreService } from '../../../services/firestore.service';
import { Dialog } from '@angular/cdk/dialog';
import { AunouncementDialogComponent } from '../../visitor/aunouncement-dialog/aunouncement-dialog.component';
import { Subscription, take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnouncementService {

    documentId: string = 'Ap83b8KjgY7wKkBn6KgZ'
    fs = inject(FirestoreService);
    dialog = inject(Dialog)

    constructor(
        private firestore: Firestore
    ) { }

    setAnnouncementStatus(status: boolean) {
        const path = `anouncementStatus/${this.documentId}`
        const updateAnouncementStatus = doc(this.firestore, path);
        return updateDoc(updateAnouncementStatus, { status: status })
    }
    getAnouncementsArray() {
        return this.fs.collection(`anouncementStatus`)
    }
    getAnouncement() {
        const promise = new Promise((resolve, reject) => {
            this.fs.collection('anouncementStatus').subscribe((anouncementsArray: Anouncement[]) => {
                resolve(anouncementsArray[0])
            })
        })
        return promise
    }

    setAnouncement(anouncement: Anouncement) {

        const path = `anouncementStatus/${this.documentId}`
        const updateAnouncements = doc(this.firestore, path)
        return updateDoc(updateAnouncements, {
            anouncementNl: anouncement.anouncementNl,
            anouncementEn: anouncement.anouncementEn,
            startDate: anouncement.startDate,
            endDate: anouncement.endDate
        },)
    }
    checkAnouncementPeriod() {
        const path = `anouncementStatus`
        this.fs.collection(path).pipe(take(1)).subscribe((anouncements: Anouncement[]) => {
            const anouncement: Anouncement = anouncements[0]
            const startSeconds = anouncement.startDate.seconds
            const endSeconds = anouncement.endDate.seconds
            const todaySeconds = new Date().getTime() / 1000

            if (startSeconds < todaySeconds && todaySeconds < endSeconds) {

                this.dialog.open(AunouncementDialogComponent)

            } else {

            }
        })
    }

}
