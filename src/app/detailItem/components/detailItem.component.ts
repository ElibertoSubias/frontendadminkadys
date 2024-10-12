import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workspace',
  templateUrl: './detailItem.component.html',
  styleUrls: ['./detailItem.component.scss']
})
export class DetailItemComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService
  ){}

  id: string = "";
  dress: any = {};
  baseUrl: string = environment.appBaseUrlMedia;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.moviesService.getMovie(this.id).subscribe({
      next: (event: any) => {
        this.dress = event.dressExistente;
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.cookies.delete("token");
          this.router.navigate([`/login`]);
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al obtener vestidos!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
    });
  }

  removeItem() {
    Swal.fire({
      title: "¿Desea eliminar el vestido?",
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: `Eliminar`,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isDenied) {
        this.moviesService.removeMovie(this.dress._id).subscribe({
          next: (event: any) => {
            this.router.navigate([`/home`]);
          },
          error: (err: any) => {
            console.log(err);
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Ocurrio un error al eliminar vestido, intenta de nuevo!",
              showConfirmButton: false,
              timer: 1500
            });
          },
        });
      }
    });
  }

}
