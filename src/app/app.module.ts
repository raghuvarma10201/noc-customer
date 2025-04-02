import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from './interceptors/http.interceptor';

import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { TranslationService } from './services/translation.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http); // This will be overridden dynamically
}
// Custom Missing Translation Handler
export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.warn(`Missing translation for: ${params.key}`);
    return params.key; // Return the key itself if the translation is missing
  }
}
// 🔥 Custom Route Reuse Strategy to Force Reload
export class CustomReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig && false; // Always return false to prevent route reuse
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      defaultLanguage: '1', // Set default language
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true, // Allow multiple interceptors
    },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }, 
    Diagnostic// 👈 Use Custom Strategy
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private translate: TranslationService) {
    //this.translate.loadTranslationsFromAPI('1'); // Set fallback language to English
  }
}
