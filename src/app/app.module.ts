import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_SERVICES } from './app.services';
import { HttpClientModule } from '@angular/common/http';
import { UiCoreModule } from '../components/ui-core/ui-core.module';
import { AppCoreModule } from '../components/app-core/app-core.module';
import { InterceptorModule } from '../interceptor/interceptor.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InterceptorModule,
    HttpClientModule,
    UiCoreModule,
    AppCoreModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    ...APP_SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
