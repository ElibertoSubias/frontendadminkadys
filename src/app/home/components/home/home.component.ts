import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { MoviesService } from '../../../services/movies.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  movies: any[] = [];
  baseUrl: string = environment.appBaseUrlMedia;
  defaultOrder: boolean = true;
  tipoFiltro: number = 1;

  constructor(
    private http: HttpClient,
    private moviesService : MoviesService,
    private route: ActivatedRoute,
    private router: Router,
    private cookies: CookieService,
    private apiService: ApiService
  ) {

   }

  ngOnInit(): void {
    this.route.snapshot.queryParams['filter'];
    this.tipoFiltro = this.apiService.getTipoFiltro() ? parseInt(this.apiService.getTipoFiltro()) : 1;

    this.moviesService.getMoviesByFilter(this.apiService.getTipoFiltro() ? parseInt(this.apiService.getTipoFiltro()) : 1, this.route.snapshot.queryParams['filter']).subscribe({
      next: (event: any) => {
        this.movies = event.dresses;
      },
      error: (err: any) => {
        console.log(err);
        if (err.status == 401) {
          this.cookies.delete("token");
          this.router.navigate([`/login`]);
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al obtener la informacion!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
    });
  }

  changeOrderBy() {
    this.defaultOrder = !this.defaultOrder;
    this.movies = this.sortMovie();
  }

  cambiarFiltro(tipo: number) {
    this.tipoFiltro = tipo;
    this.apiService.setTipoFiltro(this.tipoFiltro);
    this.moviesService.getMoviesByFilter(this.tipoFiltro, this.route.snapshot.queryParams['filter']).subscribe({
      next: (event: any) => {
        this.movies = event.dresses;
      },
      error: (err: any) => {
        console.log(err);
        if (err.status == 401) {
          this.cookies.delete("token");
          this.router.navigate([`/login`]);
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al obtener la informacion!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
    });
  }

  sortMovie() {
    let order = this.defaultOrder;
    const rta = this.movies.sort(function(a, b){
      if(a.idDress < b.idDress) { return order ? -1 : 1; }
      if(a.idDress > b.idDress) { return order ? 1 : -1; }
      return 0;
  })
    return rta;
  }

}
