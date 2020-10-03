import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppCoreKeys } from '../services/app-core.keys';
import { AppCoreService } from '../services/app-core.service';

@Injectable({
    providedIn: 'root',
})
export class NaoAutenticacaoGuard implements CanActivate {

    constructor(
        private appcoreService: AppCoreService
    ) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return !this.appcoreService.get(AppCoreKeys.ACCESS_TOKEN);
    }

}