import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'all-reservations',
  templateUrl: './all-reservations.component.html',
  styleUrls: ['./all-reservations.component.scss']
})
export class AllReservationsComponent implements OnInit {

  currentDate: any = new Date();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService
  ){}

  listItems: any = [];

  ngOnInit(): void {
    this.moviesService.getAllReservatios().subscribe({
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

}
