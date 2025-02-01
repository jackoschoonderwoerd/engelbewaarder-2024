import { Component, inject } from '@angular/core';
import { CompanyStore } from '../../services/company.store';
import { UiStore } from '../../services/ui.store';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    companyStore = inject(CompanyStore);
    uiStore = inject(UiStore);
}
