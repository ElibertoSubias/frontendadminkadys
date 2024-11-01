import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';  
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'portadas',
  templateUrl: './portadas.component.html',
  styleUrls: ['./portadas.component.scss']
})
export class PortadasComponent implements OnInit {

  portadaForm: FormGroup;
  baseUrl: string = environment.appBaseUrlMedia;

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private router: Router,
    private cookies : CookieService,
    private apiService : ApiService
  ){
    this.portadaForm = this.fb.group({
      imagenUrl: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      position: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    })
  }

  @ViewChild('fileImagenUrl') fileImagenUrl!:ElementRef;
  @ViewChild('txtPosition') txtPosition!:ElementRef;

  imagenUrl: string = "";
  position: string = "";
  portadas: any = [];
  idPortada: any = null;

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file?: File;

  ngOnInit(): void {
    this.moviesService.getTopPortadas().subscribe({
      next: (event: any) => {
        this.portadas = event.result;
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.apiService.logout();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al obtener las portadas!",
            showConfirmButton: false,
            timer: 2500
          });
        }
      }
    });
  }

  saveItem() {
    if (this.idPortada) {
      this.moviesService.updatePortada(this.portadaForm.value, this.idPortada).subscribe({
        next: (event: any) => {
          
          // Subimos portada en caso de ser grabada con exito
          this.onUpload(event.result._id);
          
        },
        error: (err: any) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al subir imagen, intenta de nuevo!",
            showConfirmButton: false,
            timer: 2500
          });
        }
      });
    } else {
      this.moviesService.savePortada(this.portadaForm.value).subscribe({
        next: (event: any) => {
          
          // Subimos portada en caso de ser grabada con exito
          this.onUpload(event.portada._id);
          
        },
        error: (err: any) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al subir imagen, intenta de nuevo!",
            showConfirmButton: false,
            timer: 2500
          });
        }
      });
    }

  }

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  addPortada() {
    this.fileImagenUrl?.nativeElement.click();
  }

  onUpload(id: string) {
    if (this.file) {
      const formData = new FormData();
  
      formData.append('archivo', this.file, this.file.name);
  
      this.moviesService.uploadPortada(formData, id).subscribe({
        next: (event: any) => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        },
        error: (err: any) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error al grabar imagen, intenta de nuevo!",
            showConfirmButton: false,
            timer: 2500
          });
        },
        complete: () => {
          // this.currentFile = undefined;
        },
      });
    } else {
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
  }

  editar(item: any) {
    this.idPortada = item._id;
    setTimeout(() => {
      this.portadaForm.patchValue({
        imagenUrl: item.imagenUrl,
        position: item.position
      });
    }, 1000)
  }

  eliminar(item: any) {
    this.moviesService.removePortada(item._id, item.imagenUrl).subscribe({
      next: (event: any) => {
        
        // Correcto
        Swal.fire({
          title: "Portada eliminada!",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok"
        }).then((result) => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        });
      },
      error: (err: any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Ocurrio un error al eliminar portada, intenta de nuevo!",
          showConfirmButton: false,
          timer: 2500
        });
        console.log(err);
      },
      complete: () => {
        // this.currentFile = undefined;
      },
    });
  }

}
