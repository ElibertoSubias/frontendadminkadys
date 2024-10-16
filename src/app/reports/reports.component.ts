import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workspace',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  opcion: number = 0;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService
  ){
    router.events.subscribe((val) => {
      if (this.router.url.indexOf('/reports/out-for-today') > -1) {
        this.opcion = 1;
      } else if (this.router.url.indexOf('/reports/entries-for-today') > -1) {
        this.opcion = 2;
      } else if (this.router.url.indexOf('/reports/future-outs') > -1) {
        this.opcion = 3;
      }
    });
  }

  ngOnInit(): void {

  }

}
