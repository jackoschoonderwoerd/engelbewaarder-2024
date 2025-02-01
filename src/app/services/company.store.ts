

import { Injectable } from '@angular/core';

import { signalStore, patchState, withComputed, withMethods, withState } from "@ngrx/signals";

type CompanyState = {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    telephone: string;
    email: string;
    timeWeekdayOpen: string;
    timeWeekdayClosed: string;
    timeWeekendOpen: string;
    timeWeekendClosed: string;
    timeClosedEarly: string;
    lunchStart: string;
    lunchEnd: string;
    snacksStart: string;
    snacksEnd: string;
    dinnerStart: string;
    dinnerEnd: string;
    jazzStart: string;
    jazzEnd: string

}
const initialState: CompanyState = {
    name: 'Café de Engelbewaarder',
    address: 'Kloveniersburgwal',
    zipCode: '1011 JZ',
    city: 'Amsterdam',
    telephone: '020 625 37 72',
    email: 'cafedeengelbewaarder@gmail.com',
    timeWeekdayOpen: '12:00',
    timeWeekdayClosed: '01:00',
    timeWeekendOpen: '12:00',
    timeWeekendClosed: '02:00',
    timeClosedEarly: '00:00',
    lunchStart: '12:00',
    lunchEnd: '16:00',
    snacksStart: '12:00',
    snacksEnd: '22:00',
    dinnerStart: '17:30',
    dinnerEnd: '21:30',
    jazzStart: '16:30',
    jazzEnd: '19:00'
}
export const CompanyStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),
    withMethods(
        ((store) => ({
            // startLoading() {
            //     patchState(store, { isLoading: true })
            // },
            // stopLoading() {
            //     patchState(store, { isLoading: false })
            // },
            // selectLanguage(selectedLanguage: string) {
            //     patchState(store, { selectedLanguage })
            // }
        }))
    ),
)
