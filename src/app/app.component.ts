import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { FirestoreService } from './services/firestore.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { HeaderComponent } from './navigation/header/header.component';
import { FooterComponent } from './navigation/footer/footer.component';

import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthStore } from './auth/login/auth.store';
import { User as FirebaseUser } from "@angular/fire/auth";
import { BannerComponent } from './pages/visitor/banner/banner.component';
import { UiStore } from './services/ui.store';
import { take } from 'rxjs';
import { AnouncementService } from './pages/admin/add-anouncement/anouncement.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSidenavModule,
        SidenavComponent,
        HeaderComponent,
        FooterComponent,
        BannerComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'engelbewaarder-2024';
    private authStore = inject(AuthStore)
    // fs = inject(FirestoreService);
    private afAuth = inject(Auth);
    public uiStore = inject(UiStore);
    router = inject(Router)
    // @ViewChild('header') header: ElementRef;
    anouncementService = inject(AnouncementService)
    // swUpdate = inject(SwUpdate)
    @ViewChild('routerContainer') private routerContainer: ElementRef;
    @ViewChild('footerContainer') private footerContainer: ElementRef;
    @ViewChild('header') private header: ElementRef;
    // @ViewChild('sidenavContent') private sidenavContent: any;
    routerMinHeight: number

    @HostListener('window:resize', ['$event']) onResizeHandler(event: any): void {
        console.log('height: ', event.target.innerHeight);
        this.calculateMinHeightRouterContainer(event.target.innerHeight)
    }



    ngOnInit(): void {





        this.router.events.subscribe((e: any) => {
            if (e.url) {
                const url = e.url
                this.uiStore.setShowBanner(url)
            }
        })
        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                this.authStore.persistLogin();
            }
        })
        this.anouncementService.checkAnouncementPeriod();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const windowHeight = window.innerHeight;
            this.calculateMinHeightRouterContainer(windowHeight)
        }, 0);
    }

    calculateMinHeightRouterContainer(windowHeight: number): void {
        let footerHeight: number = 0
        if (this.footerContainer) {
            footerHeight = this.footerContainer.nativeElement.offsetHeight;
        }
        const headerHeight = this.header.nativeElement.offsetHeight;
        this.routerMinHeight = windowHeight - headerHeight - footerHeight;
    }

}
