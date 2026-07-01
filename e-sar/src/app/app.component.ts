import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RouterOutlet } from '@angular/router';

import { SidebarComponent }
from './layout/sidebar/sidebar.component';

import { TopbarComponent }
from './layout/topbar/topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  collapsed = false;

  constructor(
    public router: Router
  ) {}

  toggleSidebar() {

    this.collapsed =
      !this.collapsed;

  }

}