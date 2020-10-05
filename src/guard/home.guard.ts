import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppCoreKeys } from '../services/app-core.keys';
import { AppCoreService } from '../services/app-core.service';
import { HomeMedicoRoute, HomeSecretarioRoute} from '../app/app-routing.route';

@Injectable({
    providedIn: 'root',
})
export class HomeGuard implements CanActivate {

    constructor(
        private appcoreService: AppCoreService,
        private router:Router
    ) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(this.appcoreService.isMedicoAtivo()){
            this.router.navigate([HomeMedicoRoute.path]);
            return false;
        }
        else if(this.appcoreService.isSecretario()){
            this.router.navigate([HomeSecretarioRoute.path]);
            return false;
        }
        else{
            return true;
        }
    }

}