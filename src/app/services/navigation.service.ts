import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigatorService {
    constructor(private router: Router, private location: Location) {}
    
    
    navigateReport(){
        this.router.navigate(['report']);
    }


    back(){
        this.location.back();
    }
    
}

  

