import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-preview-html',
    imports: [],
    templateUrl: './preview-html.component.html',
    styleUrl: './preview-html.component.scss'
})
export class PreviewHtmlComponent {
    @Input() public html: string
}
