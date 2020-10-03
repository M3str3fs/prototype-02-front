import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTopBarComponent } from './app-top-bar/app-top-bar.component';
import { AppLoadingComponent } from './app-loading/app-loading.component';
import { AppCadastroRapidoUsuarioComponent } from './app-cadastro-rapido-usuario/app-cadastro-rapido-usuario.component';
import { UiCoreModule } from '../ui-core/ui-core.module';

const COMPONENTES = [
    AppTopBarComponent,
    AppLoadingComponent,
    AppCadastroRapidoUsuarioComponent
];

@NgModule({
    declarations: COMPONENTES,
    imports: [CommonModule, FormsModule, UiCoreModule],
    exports: COMPONENTES
})
export class AppCoreModule { }
