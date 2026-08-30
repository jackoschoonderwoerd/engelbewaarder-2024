import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-cook',
    imports: [MatIconModule, RouterLink],
    templateUrl: './cook.component.html',
    styleUrl: './cook.component.scss'
})
export class CookComponent {

    router = inject(Router)


}
