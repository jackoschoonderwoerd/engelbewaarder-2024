import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';


@Injectable({
    providedIn: 'root'
})
export class ApplyService {




    private functions = getFunctions(getApp(), 'europe-west1');

    send(data:
        {
            city: string
            email: string;
            date_of_birth: string;
            motivation: string;
            name: string;
            street_number: string
            street: string;
            zipcode: string;
            phone: string;
            kitchen: boolean;
            bar: boolean;
            catering_industry_experience: string;
            for_how_long: string;
            holliday_festival_plans: string
        }
    ) {
        console.log(data);
        console.log(getApp().options);
        console.log(this.functions);
        const fn = httpsCallable(this.functions, 'sendContactForm');
        return fn(data);
    }

    private returnString() {
        return 'hi there'
    }
}
