import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({

      next: (data: any) => {

        localStorage.setItem(
          'token',
          data.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        );

        console.log(data.user);

        this.router.navigate([
          '/dashboard'
        ]);

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

}