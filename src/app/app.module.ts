import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './layout/components/header/header.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { NavLeftComponent } from './layout/components/nav-left/nav-left.component';
import { ContentLayoutComponent } from './layout/components/content-layout/content-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfigService } from './services/config.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from './interceptors/jwt.interceptor';
import { LogoutTimerInterceptor } from './interceptors/logout-timer.interceptor'; // ¡Tu nuevo interceptor!


export function ConfigLoader(ConfigService: ConfigService) {
  return () => ConfigService.getJSON();
}

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    HeaderComponent,
    FooterComponent,
    NavLeftComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync(),
    ConfigService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogoutTimerInterceptor, // Primero este, para gestionar los temporizadores
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, // Token de inyección para interceptores HTTP
      useClass: AuthTokenInterceptor, // La clase de tu interceptor
      multi: true // ¡Importante! Permite que existan múltiples interceptores
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
