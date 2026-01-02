import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button-card',
  standalone: true,
  templateUrl: './card-button.component.html',
  styleUrls: ['./card-button.component.css']
})
export class UICardButton {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() icon: string = '';
}
