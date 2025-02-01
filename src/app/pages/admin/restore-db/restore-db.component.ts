import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Consumption } from '../models/consumption.model';
import { Category } from '../models/category.model';
import { DocumentData } from '@angular/fire/firestore';
import { Subscription, take } from 'rxjs';

@Component({
    selector: 'app-restore-db',
    imports: [],
    templateUrl: './restore-db.component.html',
    styleUrl: './restore-db.component.scss'
})
export class RestoreDbComponent {
    fs = inject(FirestoreService);

    onCoffeeAndTea() {
        this.fs.findDoc('dinner', 'courseNameEnglish', 'meat')
            .subscribe((cnt: any) => {
                console.log(cnt)
                this.getCnt(cnt[0].id)
            })
    }
    getCnt(documentId) {
        const path = `dinner/${documentId}/dishes`
        console.log(path)
        this.fs.sortedCollection(path, 'seqNo', 'desc').pipe(take(1))
            .subscribe((dishes: any) => {
                console.log(dishes)
                for (let i = 0; i < dishes.length; i++) {
                    const firstDish = dishes[i]
                    const consumption: Consumption = {
                        descriptionEn: firstDish.descriptionEnglish,
                        descriptionNl: firstDish.descriptionDutch,
                        nameEn: firstDish.nameEnglish,
                        nameNl: firstDish.nameDutch,
                        price: firstDish.price,
                        availableOutside: true
                    }
                    console.log(consumption)
                    this.getCnt2024(consumption)
                }

            })

    }
    getCnt2024(consumption: Consumption) {
        const path2024 = `dinner-categories-2024`
        const subscription: Subscription = this.fs.findDoc(path2024, 'nameEn', 'meat')
            .subscribe((categories: Category[]) => {
                console.log(categories)
                const categoryCoffeeAndTea2024: Category = categories[0]

                this.pushNewConsumption(categoryCoffeeAndTea2024.id, consumption)
                subscription.unsubscribe();
            })
    }
    pushNewConsumption(categoryId: string, consumption: Consumption) {
        const path = `dinner-categories-2024/${categoryId}`
        this.fs.addElementToArray(path, 'consumptions', consumption)
            .then((res: any) => {
                console.log('array updated')
            })
    }
}
