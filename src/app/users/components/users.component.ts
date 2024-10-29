import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Genre } from '../../interfaces/Genre';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  userForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private router: Router,
    private location: Location,
    private cookies: CookieService,
    private apiService: ApiService
  ){
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apMaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      contrasenia: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      contraseniaConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      tipoEmpleado: ['', [Validators.required]],
    })
  }

  ngAfterViewInit(): void {
  }

  @ViewChild('txtNombre') txtNombre!:ElementRef;
  @ViewChild('txtApPaterno') txtApPaterno!:ElementRef;
  @ViewChild('txtApMaterno') txtApMaterno!: ElementRef;
  @ViewChild('txtContrasenia') txtContrasenia!: ElementRef;
  @ViewChild('txtContraseniaConfirm') txtContraseniaConfirm!: ElementRef;
  @ViewChild('txtTipoEmpleado') txtTipoEmpleado!:ElementRef;

  nombre: string = "";
  apPaterno: string = "";
  apMaterno: string = "";
  contrasenia: string = "";
  contraseniaConfirm: string = "";
  tipoEmplado: string = "";
  userSelected: any = null;
  users: any = [];

  ngOnInit(): void {
    this.moviesService.getUsers().subscribe({
      next: (event: any) => {
        this.users = event.users;
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.router.navigate([`/login`]);
        }
        console.log(err);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al obtener usuarios!",
          showConfirmButton: false,
          timer: 2500
        });
      },
    });
  }

  editar(item: any) {
    this.userSelected = item._id;
    setTimeout(() => {
      this.userForm.patchValue({
        nombre: item.nombre,
        apPaterno: item.apPaterno,
        apMaterno: item.apMaterno,
        tipoEmpleado: item.tipoEmpleado,
        contrasenia: item.contrasenia
      });
    }, 500)
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

  addUser() {
    if (this.userForm.value.contrasenia != this.userForm.value.contraseniaConfirm) {
      Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Las contraseñas no son iguales!",
          showConfirmButton: false,
          timer: 1500
        });
      this.txtContrasenia.nativeElement.focus();
      return;
    }
    this.moviesService.saveUser(this.userForm.value).subscribe({
      next: (event: any) => {
        Swal.fire(event.msg);
        this.userForm.reset();
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al crear usuario, intenta de nuevo!",
          showConfirmButton: false,
          timer: 2500
        });
        console.log(err);
      }
    });
  }

  editUser() {
    this.moviesService.editUser(this.route.snapshot.params['_id'], this.userForm.value).subscribe({
      next: (event: any) => {
        Swal.fire("Usuario actualizado con exito!");
        this.userForm.reset();
        this.router.navigate([`/reports`]);
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al crear usuario, intenta de nuevo!",
          showConfirmButton: false,
          timer: 2500
        });
        console.log(err);
      }
    });
  }

  delete(item: any) {
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: `Eliminar`,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isDenied) {
        this.moviesService.deleteUser(item._id, this.apiService.getUser("userNumber")).subscribe({
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
              title: err.error.msg,
              showConfirmButton: false,
              timer: 1500
            });
          },
        });
      }
    });
  }

}
