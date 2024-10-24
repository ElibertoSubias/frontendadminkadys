import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataExampleDialog } from '../modalDetall/modalDetalle.component';

@Component({
  selector: 'entries-for-today',
  templateUrl: './entries-for-today.component.html',
  styleUrls: ['./entries-for-today.component.scss']
})
export class EntriesForTodayComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService
  ){}

  listItems: any = [];
  currentDate: any = new Date();
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.moviesService.getEntriesForToday(this.formatDate(this.currentDate)).subscribe({
      next: (event: any) => {
        this.listItems = event.result;
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al cargar reporte!",
          showConfirmButton: false,
          timer: 2500
        });
      },
    });
  }

  addDays(date: string, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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

  diasPendietes(fecha1: string, fecha2: string) {
    var fechaInicio = new Date(fecha1).getTime();
    var fechaFin    = new Date(fecha2).getTime();

    var diff = fechaFin - fechaInicio;

    return diff/(1000*60*60*24);
  }

  openDialog(item: any, tipoLlamado: number) {
    item.tipoLlamado = tipoLlamado;
    this.dialog.open(DialogDataExampleDialog, {
      data: item,
      width: '600px',
    });
  }

}
