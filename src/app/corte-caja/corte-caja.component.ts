import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workspace',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.scss']
})
export class CorteCajaComponent implements OnInit {

  opcion: number = 1;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService
  ){
    router.events.subscribe((val) => {
      if (this.router.url == '/corte') {
        this.opcion = 1;
      } else if (this.router.url == '/corte/entries-for-today') {
        this.opcion = 2;
      } else if (this.router.url == '/corte/future-outs') {
        this.opcion = 3;
      }
    });
  }

  ngOnInit(): void {

  }

}
