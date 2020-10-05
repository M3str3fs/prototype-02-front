import { IfStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AppCoreService } from 'src/services/app-core.service';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiUsuarioService } from '../../../services/api-usuario.service';

@Component({
    selector: 'app-cadastro-rapido-usuario-component',
    templateUrl: './app-cadastro-rapido-usuario.component.html',
    styleUrls: ['./app-cadastro-rapido-usuario.component.scss']
})
export class AppCadastroRapidoUsuarioComponent implements OnInit, OnChanges {

    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService
    ) {

    }

    @Input('usuario-id')
    public _usuarioId: string = undefined;

    @Input('custom-title')
    public _customTitle: boolean = false;

    @Input('read-only')
    public _readOnly: boolean = false;

    @Output('on-usuario-confirmado')
    public _onUsuarioConfirmado: EventEmitter<UsuarioModel> = new EventEmitter();

    public oUsuarioNovo = { label: 'Novo', id: 'N' };
    public oUsuarioExistente = { label: 'Existente', id: 'E' };
    public oSelecaoUsuario = [this.oUsuarioNovo, this.oUsuarioExistente];
    public usuarioSelecionado: UsuarioModel;

    public sUsuario: string;
    public usuario: UsuarioModel;

    public ngOnInit() {
        this.doInit(this._usuarioId);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['_usuarioId']) {
            this.doInit(this._usuarioId);
        }
    }

    public doInit(id: string) {
        if (id) {
            this.appCoreService.setLoading(this.doInit)
            this.apiUsuarioService.query([this._usuarioId])
                .then((r) => {
                    this.usuario = r[0];
                    this.usuarioSelecionado = this.usuario;
                    this.sUsuario = this.oUsuarioExistente.id;
                })
                .finally(() => this.appCoreService.setLoaded(this.doInit));
        }
        else {
            this.sUsuario = this.oUsuarioNovo.id;
            switch (this.sUsuario) {
                case (this.oUsuarioExistente.id):
                    this.usuario = undefined;
                    break;
                case (this.oUsuarioNovo.id):
                    this.usuario = {} as UsuarioModel;
                    break;
            }
        }
    }

    public doCadastrarUsuario() {
        return this.apiUsuarioService.post(this.usuario)
            .then((response) => this.onUsuarioConfirmado(response));
    }

    public onUsuarioSelecaoSelecionada() {
        switch (this.sUsuario) {
            case (this.oUsuarioExistente.id):
                this.usuario = undefined;
                break;
            case (this.oUsuarioNovo.id):
                this.usuario = {} as UsuarioModel;
                break;
        }
    }

    public onUsuarioConfirmado(usuario: UsuarioModel) {
        this.sUsuario = this.oUsuarioNovo.id;
        this.usuario = usuario;
        this._onUsuarioConfirmado.emit(this.usuario);
    }

    public getUiDataSelectUsuarioQuery() {
        return (text: string) => {
            return this.apiUsuarioService.queryPaged(text).page(1, 10).then((r) => r.docs);
        }
    }

    public getUiDataSelectUsuarioLabel(item: UsuarioModel, onField: boolean) {
        if (onField) {
            return item.nome
        } else {
            return `<b>Nome</b>: ${item.nome}<br></br><b>Documento</b>: ${item.documento}<br></br><b>Email</b>:${item.email}<br></br><b>Telefone</b>:${item.telefone}`;
        }
    }

    public isSomenteLeitura() {
        return this._readOnly;
    }

    public isUsuarioSelecionado() {
        return this.usuario && this.usuario._id;
    }

}