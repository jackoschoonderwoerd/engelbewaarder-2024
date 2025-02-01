import { inject, Injectable } from '@angular/core';
import { UiStore } from '../services/ui.store';

export interface NavListItem {
    dutch: string;
    english: string;

}

@Injectable({
    providedIn: 'root'
})


export class NavigationService {

    constructor() { }

    uiStore = inject(UiStore)

    navListItems: NavListItem[] = [
        // {
        //     dutch: 'restore-db',
        //     english: 'restore-db'
        // },

        {
            dutch: 'foto\'s',
            english: 'photos'

        },
        {
            dutch: 'exposities',
            english: 'exhibitions',
        },
        {
            dutch: 'bieren',
            english: 'beers',
        },
        {
            dutch: 'dranken',
            english: 'drinks'
        },
        {
            dutch: 'snacks',
            english: 'snacks'
        },
        {
            dutch: 'lunch',
            english: 'lunch'
        },
        {
            dutch: 'diner',
            english: 'dinner',
        },
    ]

    adminNavListItems: NavListItem[] = [


        {
            dutch: 'admin',
            english: 'admin'

        },
        {
            dutch: 'aankondiging',
            english: 'anouncement',
        },
    ]



    getNavListItems() {
        return this.navListItems;
    }

    gatAdminNavListItems() {
        return this.adminNavListItems;
    }
}
