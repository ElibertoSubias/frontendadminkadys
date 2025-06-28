import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataExampleDialog } from '../modalDetall/modalDetalle.component';
import { ApiService } from "../../../services/api.service";
import { EventTicketData } from '../../../ticket-printer/ticket-printer.component'; // Importa la interfaz

@Component({
  selector: 'today-reservations',
  templateUrl: './today-reservations.component.html',
  styleUrls: ['./today-reservations.component.scss']
})
export class TodayReservationsComponent implements OnInit {

  currentDate: any = new Date();
  showTicketPreview: boolean = false;
  folioTicket: string = "";

  // Datos del ticket que pasarás al componente ticket-printer
  ticketData: EventTicketData = {
    evento: '',
    fecha: '',
    hora: '',
    talla: '',
    nombreCliente: '',
    fechaRecoleccion: '',
    precio: '',
    numTicket: '',
    codigo: '',
    anticipo: '',
    restante: ''
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService,
    private apiService : ApiService
  ){}

  listItems: any = [];
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.moviesService.getTodayReservatios(this.formatDate(this.currentDate)).subscribe({
      next: (event: any) => {
        this.listItems = event.result;
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.apiService.logout();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al obtener reporte!",
            showConfirmButton: false,
            timer: 2500
          });
        }
      },
    });
  }

  obtenerFechaFormatoDDMMYYYY(hoy = new Date()) {
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
    const anio = hoy.getFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }

  obtenerHoraFormatoHHMM() {
    const hoy = new Date();
    const horas = String(hoy.getHours()).padStart(2, '0'); // Obtiene las horas (0-23) y asegura dos dígitos
    const minutos = String(hoy.getMinutes()).padStart(2, '0'); // Obtiene los minutos (0-59) y asegura dos dígitos
  
    return `${horas}:${minutos}`;
  }

  reimprimirTicket(idReservation: any) {
    this.imprimirTicket(idReservation)
    
  }

  async imprimirTicket(idReservation: string): Promise<boolean> {
    try {
      this.moviesService.getTicketInfo(idReservation).subscribe({
        next: (response: any) => {
          // 1. Prepara los datos del ticket
          this.ticketData = {
            evento: 'Concierto de Verano ' + Math.floor(Math.random() * 100), // Ejemplo dinámico
            fecha: this.obtenerFechaFormatoDDMMYYYY(new Date(response.data.reservacion.creado.replace("Z", ""))),
            hora: this.obtenerHoraFormatoHHMM(),
            talla: response.data.reservacion.talla,
            precio: '600',
            nombreCliente: response.data.cliente.nombre,
            fechaRecoleccion: this.obtenerFechaFormatoDDMMYYYY(new Date(response.data.reservacion.fechaRecoleccion.replace("Z", ""))),
            numTicket: `#TICKET ${String(response.data.ticket.folio).padStart(5, '0')}`,
            codigo: "",
            anticipo: response.data.reservacion.anticipo,
            restante: response.data.reservacion.cantRestante
          };

          // 2. Muestra el componente del ticket
          this.showTicketPreview = true;
          // / 3. Ejecuta la impresión automáticamente
          // Esto esperará un momento para que Angular renderice el ticket antes de imprimir
          setTimeout(() => {
            this.imprimirTicketFinal();
          }, 100); // Pequeño retraso para asegurar el renderizado
          console.log("Ticket impreso correctamente!");
          console.log("Grabar ticket");
          return true;
        },
        error: (err: any) => {
          if (err.status == 401) {
            this.apiService.logout();
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Ocurrio un error al obtener datos del ticket!",
              showConfirmButton: false,
              timer: 2500
            });
          }
          return false;
        },
      });
      return true;
    } catch (error) {
      console.log("Error al imprimir ticket");
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Ocurrió un error al imprimir ticket, puedes consultar para reimprimir!",
        showConfirmButton: false,
        timer: 1500
      });
      return false;
    }
  }

  imprimirTicketFinal() {
    window.print();
    // Opcional: Ocultar el ticket después de imprimir si no quieres que se vea en pantalla
    setTimeout(() => {
      this.showTicketPreview = false;
    }, 500); 
  }

  formatDate(d: Date) {
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }

  openDialog(item: any, tipoLlamado: number) {
    item.tipoLlamado = tipoLlamado;
    this.dialog.open(DialogDataExampleDialog, {
      data: item,
      width: '600px',
    });
  }

  cancelReservation(id: string, nombre: string) {
    Swal.fire({
      title: `¿Desea cancelar la reservación de ${nombre}?`,
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: `Aceptar`,
      cancelButtonText: "Salir"
    }).then((result) => {
      if (result.isDenied) {
        this.moviesService.changeStatusReservation(id, false).subscribe({
          next: (event: any) => {
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          },
          error: (err: any) => {
            console.log(err);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Ocurrio un error al cancelar la reservacion, intenta de nuevo!",
              showConfirmButton: false,
              timer: 2500
            });
          },
        });
      }
    });
  }

}
