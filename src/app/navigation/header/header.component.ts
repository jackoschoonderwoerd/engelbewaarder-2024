import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { NavigationService, NavListItem } from '../navigation.service';
import { MatListModule } from '@angular/material/list'
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../auth/login/auth.store';
import { UiStore } from '../../services/ui.store';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SelectLanguageComponent } from '../../pages/admin/select-language/select-language.component';

import { NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, Subscription } from 'rxjs';
import { computed } from '@angular/core';


@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        MatListModule,
        RouterModule,
        MatIconModule,
        SelectLanguageComponent,
        MatMenuModule,
        MatButtonModule

    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
    navigationService = inject(NavigationService);

    navListItems: NavListItem[] = [];
    authStore = inject(AuthStore)
    uiStore = inject(UiStore);
    adminNavListItems: NavListItem[] = [];
    router = inject(Router)

    vacaturesActive = false;
    private routerSub?: Subscription;

    currentUrl = toSignal(
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            map(event => event.urlAfterRedirects)
        ),
        { initialValue: this.router.url }
    );

    // vacaturesActive = computed(() =>
    //     this.currentUrl().startsWith('/apply') ||
    //     this.currentUrl().startsWith('/cook')
    // );

    // constructor(public router: Router) { }

    @Output() sidenavToggle = new EventEmitter<void>();

    ngOnInit(): void {
        this.navListItems = this.navigationService.getNavListItems();
        this.adminNavListItems = this.navigationService.gatAdminNavListItems();
        this.routerSub = this.router.events
            .pipe(
                filter((event): event is NavigationEnd =>
                    event instanceof NavigationEnd
                )
            )
            .subscribe(event => {
                console.log('URL:', event.urlAfterRedirects);
                this.setVacaturesActive(event.urlAfterRedirects);
                console.log('URL:', event.urlAfterRedirects);
            });

    }

    private setVacaturesActive(url: string) {
        console.log(url)
        this.vacaturesActive =
            url.startsWith('/apply') ||
            url.startsWith('/cook');
    }

    selectLanguage(selectedLanguage: string) {
        this.uiStore.selectLanguage(selectedLanguage)
    }
    onToggleSidenav() {
        this.sidenavToggle.emit();
    }

    onForm() {
        console.log('edit');

    }

    onCook() {
        console.log('copy');
    }

    ngOnDestroy() {
        this.routerSub?.unsubscribe();
    }
}
