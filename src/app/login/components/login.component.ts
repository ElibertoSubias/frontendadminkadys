import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router:Router,
    private http: HttpClient, 
    private fb: FormBuilder,
    private moviesService : MoviesService,
    private apiService: ApiService
  ){
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasenia: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    const token = this.apiService.getToken();
    if (token) {
      this.router.navigateByUrl("/home");
    }
  }

  login() {
    const user = { usuario: this.loginForm.value.usuario, contrasenia: this.loginForm.value.contrasenia };
    this.apiService.login(user).subscribe({
      next: (event: any) => {
        this.apiService.setToken(event.token);
        this.router.navigateByUrl("/home");
      },
      error: (err: any) => {
        alert("Error al iniciar sesion")
      },
      complete: () => {
        // this.currentFile = undefined;
      },
    });
  }

}
