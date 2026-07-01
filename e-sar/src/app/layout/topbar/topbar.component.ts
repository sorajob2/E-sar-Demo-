import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { AuthService }
from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {

  @Output()
  toggle =
    new EventEmitter<void>();

  constructor(
    public auth: AuthService
  ) {}

}