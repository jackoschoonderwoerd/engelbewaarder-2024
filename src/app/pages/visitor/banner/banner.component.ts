import { Component, inject } from '@angular/core';
import { UiStore } from '../../../services/ui.store';
import { CompanyStore } from '../../../services/company.store';

@Component({
    selector: 'app-banner',
    imports: [],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.scss'
})
export class BannerComponent {
    uiStore = inject(UiStore);
    companyStore = inject(CompanyStore)
    url = 'url("/images/backgrounds/terras-boot-vanaf-cafe/terras-boot-vanaf-cafe-480px.jpg")'
    getUrl() {
        return `backgroundImage: ${this.url}`
    }
}
