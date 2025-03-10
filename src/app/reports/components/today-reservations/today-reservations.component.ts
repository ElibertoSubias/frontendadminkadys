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

@Component({
  selector: 'today-reservations',
  templateUrl: './today-reservations.component.html',
  styleUrls: ['./today-reservations.component.scss']
})
export class TodayReservationsComponent implements OnInit {

  currentDate: any = new Date();

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
