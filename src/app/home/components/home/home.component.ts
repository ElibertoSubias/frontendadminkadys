import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { MoviesService } from '../../../services/movies.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api.service';
import { fromEvent, reduce, scan, tap } from 'rxjs';

@Component({
  selector: 'app-workspace',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  movies: any[] = [];
  baseUrl: string = environment.appBaseUrlMedia;
  defaultOrder: boolean = false;
  tipoFiltro: number = 1;
  paginaActual: number = 0;
  totalBloqueEncontrado: number = 0;

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

    this.getData();

    fromEvent(document, 'scroll').pipe(
      tap(() => {
        let fullDocumentHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        );

        const haveIReachedBottom = (fullDocumentHeight) === Math.round(window.scrollY + document.documentElement.clientHeight);
        if (haveIReachedBottom && this.router.url.includes("/home") && this.totalBloqueEncontrado > 0) {
          this.paginaActual++;
          this.getData();
        }
      })
    ).subscribe();

    this.route.snapshot.queryParams['filter'];
    let tipoFiltro = this.apiService.getTipoFiltro();
    this.tipoFiltro = tipoFiltro ? parseInt(tipoFiltro) : 1;
    this.apiService.setTipoFiltro(this.tipoFiltro);

  }

  cargarMas() {
    this.paginaActual++;
    this.getData();
  }

  getData() {
    let tipoFiltro = this.apiService.getTipoFiltro();
    this.moviesService.getMoviesByFilter(this.defaultOrder ? 1 : -1, parseInt(tipoFiltro), this.route.snapshot.queryParams['filter'], 10, this.paginaActual).subscribe({
      next: (event: any) => {
        this.totalBloqueEncontrado = event.dresses.length;
        this.movies = [...this.movies,...event.dresses];
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
    this.paginaActual = 0;
    this.movies = [];
    this.getData();
  }

  cambiarFiltro(tipo: number) {
    this.tipoFiltro = tipo;
    this.apiService.setTipoFiltro(this.tipoFiltro);
    this.moviesService.getMoviesByFilter(this.defaultOrder ? 1 : -1, this.tipoFiltro, this.route.snapshot.queryParams['filter']).subscribe({
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
      if(a.numVestido < b.numVestido) { return order ? -1 : 1; }
      if(a.numVestido > b.numVestido) { return order ? 1 : -1; }
      return 0;
  })
    return rta;
  }

}
