import { AfterContentChecked, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppCoreService } from '../services/app-core.service';
import { HomePacienteRoute, UsuarioMeuPerfilMedicoRoute, UsuarioMeuPerfilRoute } from './app-routing.route';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentChecked {

  constructor(
    private appCoreService: AppCoreService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  public ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  public doGoMeuPerfilMedico() {
    this.router.navigate([UsuarioMeuPerfilMedicoRoute.path]);
  }

  public doGoHome() {
    this.router.navigate([HomePacienteRoute.path]);
  }

  public isAuthenticated() {
    return this.appCoreService.isAuthenticated();
  }

  public isLoading() {
    return this.appCoreService.isLoading();
  }

  public isMedico() {
    return this.appCoreService.isMedico();
  }

}
