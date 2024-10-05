import { Component, ElementRef, OnInit, viewChild, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('txtFiltro') txtFiltro:ElementRef | undefined;
  

  showFilter: boolean = true;

  constructor(
    public router: Router,
    private moviesService : MoviesService,
    private route: ActivatedRoute,
    private apiService : ApiService
  ) { 
    router.events.subscribe((val) => {
      if (this.router.url != "/home") {
        this.showFilter = false;
      } else {
        this.showFilter = true;
      }
  });
  }

  ngOnInit(): void {
    
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
