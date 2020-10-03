import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading-component',
    templateUrl: './app-loading.component.html',
    styleUrls: ['./app-loading.component.scss']
})
export class AppLoadingComponent implements OnInit {

    @Input('loading')
    public _loading: boolean = false;

    public ngOnInit() {

    }

}