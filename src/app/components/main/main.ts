import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { UICardButton } from '../card-button/card-button.component';
import { NavigatorService } from '../../services/navigation.service';


@Component({
  selector: 'app-main',
  imports: [CardModule, UICardButton],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class MainComponent {

    constructor(private navigatorService: NavigatorService){}

    goToReport(){
        this.navigatorService.navigateReport();
    }

}
