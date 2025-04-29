import { Component, inject } from '@angular/core';
import { UiStore } from '../../../services/ui.store';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-select-language',
    imports: [NgClass],
    templateUrl: './select-language.component.html',
    styleUrl: './select-language.component.scss'
})
export class SelectLanguageComponent {
    uiStore = inject(UiStore)

    selectLanguage(e: Event, selectedLanguage) {
        e.stopPropagation()
        this.uiStore.selectLanguage(selectedLanguage)
    }
}
