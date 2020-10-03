import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HttpRequestAutentiocacaoInterceptor } from "./http-request-autentiocacao-interceptor.interceptor";

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestAutentiocacaoInterceptor,
            multi: true,
        },
    ],
})
export class InterceptorModule { }