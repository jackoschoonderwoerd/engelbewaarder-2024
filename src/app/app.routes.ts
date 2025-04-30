import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'photos', loadComponent: () => import('./pages/visitor/photos/photos.component')
            .then(c => c.PhotosComponent)
    },
    {
        path: 'home', loadComponent: () => import('./pages/visitor/home/home.component')
            .then(c => c.HomeComponent)
    },
    {
        path: 'add-category', loadComponent: () => import('./pages/admin/add-category/add-category.component')
            .then(c => c.AddCategoryComponent)
    },
    {
        path: 'drinks', loadComponent: () => import('./pages/visitor/consumptions/consumptions.component')
            .then(c => c.ConsumptionsComponent)
    },
    {
        path: 'exhibitions', loadComponent: () => import('./pages/visitor/exhibitions/exhibitions.component')
            .then(c => c.ExhibitionsComponent)
    },
    {
        path: 'exhibition-details', loadComponent: () => import('./pages/visitor/exhibitions/exhibition-details/exhibition-details.component')
            .then(c => c.ExhibitionDetailsComponent)
    },
    {
        path: 'image-slider', loadComponent: () => import('./pages/visitor/image-slider/image-slider.component')
            .then(c => c.ImageSliderComponent)
    },
    {
        path: 'add-exhibition', loadComponent: () => import('./pages/admin/add-exhibition/add-exhibition.component')
            .then(c => c.AddExhibitionComponent)
    },
    {
        path: 'restore-db', loadComponent: () => import('./pages/admin/restore-db/restore-db.component')
            .then(c => c.RestoreDbComponent)
    },
    {
        path: 'beers', loadComponent: () => import('./pages/admin/beers/beers.component')
            .then(c => c.BeersComponent)
    },
    {
        path: 'add-beer', loadComponent: () => import('./pages/admin/beers/add-beer/add-beer.component')
            .then(c => c.AddBeerComponent)
    },
    {
        path: 'dinner', loadComponent: () => import('./pages/visitor/consumptions/consumptions.component')
            .then(c => c.ConsumptionsComponent)
    },
    {
        path: 'consumptions', loadComponent: () => import('./pages/visitor/consumptions/consumptions.component')
            .then(c => c.ConsumptionsComponent)
    },
    {
        path: 'add-consumption', loadComponent: () => import('./pages/admin/add-consumption/add-consumption.component')
            .then(c => c.AddConsumptionComponent)
    },
    {
        path: 'lunch', loadComponent: () => import('./pages/visitor/consumptions/consumptions.component')
            .then(c => c.ConsumptionsComponent)
    },
    {
        path: 'snacks', loadComponent: () => import('./pages/visitor/consumptions/consumptions.component')
            .then(c => c.ConsumptionsComponent)
    },
    {
        path: 'anouncement', loadComponent: () => import('./pages/admin/add-anouncement/add-anouncement.component')
            .then(c => c.AddAnouncementComponent)
    },
    {
        path: 'login', loadComponent: () => import('./auth/login/login.component')
            .then(c => c.LoginComponent)
    },
    {
        path: '**', redirectTo: 'home'
    }
];
