import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersService }
from '../../services/users.service';

import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent
implements OnInit {

  users: any[] = [];   // <-- ต้องมีบรรทัดนี้

  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit(): void {

    this.loadUsers();

  }

  loadUsers() {

    this.usersService
      .getAll()
      .subscribe(data => {

        this.users = data;

      });

  }

  deleteUser(id: number) {

  if (
    !confirm(
      'ต้องการลบผู้ใช้นี้หรือไม่'
    )
  ) {
    return;
  }

  this.usersService
    .delete(id)
    .subscribe({

      next: () => {

        alert('ลบสำเร็จ');

        this.loadUsers();

      },

      error: (err) => {

        console.error(err);

      }

    });

}

}