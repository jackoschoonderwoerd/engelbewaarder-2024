import { inject, Pipe, PipeTransform } from '@angular/core';
import { deleteField } from '@angular/fire/firestore';
import { UiStore } from '../services/ui.store';
@Pipe({
    name: 'consumptionTypeHeader',
})


export class ConsumptionTypeHeaderPipe implements PipeTransform {
    uiStore = inject(UiStore)
    transform(value: string): string {
        console.log(this.uiStore.selectedLanguage())


        if (this.uiStore.selectedLanguage() === 'nl' && value === 'meats') {
            return 'vleesgerechten'
        } else if (this.uiStore.selectedLanguage() === 'en' && value === 'meats')
            return 'meat'
    }
}
