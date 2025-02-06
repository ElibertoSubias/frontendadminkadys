import { Component, ElementRef, Input, OnInit, viewChild, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit {

  @ViewChild('txtFiltro') txtFiltro:ElementRef | undefined;
  @Input() movil: boolean = false;
  pathActive: string = "";

  constructor(
    public router: Router,
    private moviesService : MoviesService,
    private route: ActivatedRoute,
    private apiService : ApiService
  ) { 
    router.events.subscribe((val) => {
      this.pathActive = this.router.url;
    });
  }

  ngOnInit(): void {
    console.log(this.movil);
    
  }

  filterMovies() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(
      ['/home'],
      { queryParams: { filter: this.txtFiltro?.nativeElement.value } }
    );
  }

  salir() {
    this.apiService.logout();
    this.router.navigate([`/login`]);
  }

}
