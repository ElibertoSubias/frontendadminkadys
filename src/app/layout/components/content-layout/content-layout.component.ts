import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  constructor() { }

  showFilter: boolean = true;

  ngOnInit(): void {
  }

  addItem(newItem: string) {
    console.log(newItem);

  }

}
