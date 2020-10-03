import { AppCoreService } from 'src/services/app-core.service';
import { ApiProntuarioService } from '../services/api-prontuario.service';
import { ApiUsuarioService } from '../services/api-usuario.service';
import { ApiDominioService } from '../services/api-dominio.service';

export const APP_SERVICES = [
    ApiProntuarioService,
    ApiUsuarioService,
    ApiDominioService,
    AppCoreService,
];