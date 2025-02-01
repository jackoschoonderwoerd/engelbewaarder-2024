import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { NavigationService, NavListItem } from '../navigation.service';
import { MatListModule } from '@angular/material/list'
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../auth/login/auth.store';
import { UiStore } from '../../services/ui.store';
import { NgClass } from '@angular/common';
import { SelectLanguageComponent } from '../../pages/admin/select-language/select-language.component';


@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        MatListModule,
        RouterModule,
        MatIconModule,
        SelectLanguageComponent

    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    navigationService = inject(NavigationService);

    navListItems: NavListItem[] = [];
    authStore = inject(AuthStore)
    uiStore = inject(UiStore);
    adminNavListItems: NavListItem[];

    @Output() sidenavToggle = new EventEmitter<void>();

    ngOnInit(): void {
        this.navListItems = this.navigationService.getNavListItems();
        this.adminNavListItems = this.navigationService.gatAdminNavListItems();
    }

    selectLanguage(selectedLanguage: string) {
        this.uiStore.selectLanguage(selectedLanguage)
    }
    onToggleSidenav() {
        this.sidenavToggle.emit();
    }
}
