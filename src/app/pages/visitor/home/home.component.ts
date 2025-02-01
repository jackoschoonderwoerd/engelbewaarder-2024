import { Component, inject, OnInit } from '@angular/core';
import { CompanyStore } from '../../../services/company.store';
import { UiStore } from '../../../services/ui.store';
import { NavigationService, NavListItem } from '../../../navigation/navigation.service';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-home',
    imports: [RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    companyStore = inject(CompanyStore);
    uiStore = inject(UiStore);
    navigationService = inject(NavigationService)
    navListItems: NavListItem[] = []

    ngOnInit(): void {
        this.navListItems = this.navigationService.getNavListItems();
    }
}
