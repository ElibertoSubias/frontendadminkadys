import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Subject, Subscription, finalize, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  constructor(private authService: ApiService,) { }

  showFilter: boolean = true;
  private apiCallSubscription: Subscription | undefined;
  private destroy$: Subject<void> = new Subject<void>(); // Subject para desuscribirse
  showSessionWarning = false;
  warningTime = environment.WARNING_TIME_BEFORE_EXPIRATION_MINUTES; // El mismo tiempo que definiste en AuthService

  ngOnInit(): void {
    this.authService.onSessionWarning
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.showSessionWarning = true;
      // Swal.fire({
      //   title: `Tu sesión expirará en ${this.warningTime} minutos. ¿Quieres extenderla?`,
      //   text: "¿Desea continuar?",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonColor: "#3085d6",
      //   cancelButtonColor: "#d33",
      //   confirmButtonText: "Si",
      //   cancelButtonText: `No`
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     this.extendSession()
      //   } else {
      //     this.logout();
      //   }
      //   // this.router.navigate([`/dress/${this.id}`]);
      // });
    });
  }

  addItem(newItem: string) {
    console.log(newItem);

  }

  logout(): void {
    this.showSessionWarning = false;
    this.authService.logout();
  }

  extendSession(): void {
    // Ocultar el mensaje inmediatamente al hacer clic en "Extender Sesión"
    this.showSessionWarning = false;
    // Si usas OnPush strategy
    // this.cdr.detectChanges();
    // this.isLoading = true; // Activa el cargando
  
    this.authService.refreshToken().pipe(
      finalize(() => {
        // this.isLoading = false; // Desactiva el cargando SIEMPRE al finalizar
      })
    ).subscribe({
      next: () => {
        // No necesitas ocultarlo aquí de nuevo, ya lo hiciste.
        // Pero si quieres ser super seguro, podrías ponerlo.
        // this.showSessionWarning = false;
        // this.cdr.detectChanges(); // si usas OnPush
        console.log('Sesión extendida. El temporizador de aviso se reinició en AuthService.');
        // startSessionTimer se llama dentro de setTokens en AuthService
      },
      error: (err) => {
        console.error('No se pudo extender la sesión.', err);
        this.showSessionWarning = false; // Ocultar si falla y se va a logout
        // this.cdr.detectChanges(); // si usas OnPush
        this.authService.logout();
      }
    });
  }

}
