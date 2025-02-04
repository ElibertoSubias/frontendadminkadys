import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { MatDialog, MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { NgFor } from '@angular/common';
import {RouterModule} from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'corte-diario',
  templateUrl: './corte-diario.component.html',
  styleUrls: ['./corte-diario.component.scss'],
  standalone: true,
  imports: [MatButtonModule, NgFor, RouterModule],
})
export class CorteDiarioComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService,
    private apiService : ApiService
  ){}

  listItems: any = [];
  currentDate: any = new Date();
  dialog = inject(MatDialog);

  ngOnInit(): void {

    this.moviesService.getCorteDiario(this.formatDate(this.currentDate)).subscribe({
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
            title: "Ocurrio un error al cargar reporte!",
            showConfirmButton: false,
            timer: 1500
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

  formatoMoneda(texto: any) {
    if (!texto || texto == "") {
      texto = "0";
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(texto,);
  }

}
