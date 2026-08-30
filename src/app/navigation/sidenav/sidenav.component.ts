import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService, NavListItem } from '../navigation.service';
import { Router, RouterModule } from '@angular/router';
import { UiStore } from '../../services/ui.store';
import { AuthStore } from '../../auth/login/auth.store';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sidenav',
    imports: [MatIconModule, RouterModule, MatMenuModule, MatButtonModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

    navigationService = inject(NavigationService)
    @Output() closeSidenav = new EventEmitter<void>();
    navListItems: NavListItem[] = [];
    router = inject(Router);
    uiStore = inject(UiStore)
    authStore = inject(AuthStore)


    ngOnInit(): void {
        this.navListItems = this.navigationService.getNavListItems();
    }
    onLinkSelected(item: string) {
        this.router.navigateByUrl(item)
        this.onClose();
    }

    onClose() {
        this.closeSidenav.emit()
    }
    onLogin() {
        this.onClose();
        this.router.navigateByUrl('/login')
    }
}
