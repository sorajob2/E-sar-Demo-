import { Component } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router,ActivatedRoute,  } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'

})
export class UserFormComponent {

  form: FormGroup;

  userId:number|null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
    
  ) {

    this.form = this.fb.group({

      username: [''],
      password: [''],
      full_name: [''],
      email: [''],
      role_id: [3],
      is_active: [1]

    });
    const id =
this.route.snapshot.paramMap.get('id');

if(id){

  this.userId = Number(id);

  this.usersService
    .getById(this.userId)
    .subscribe((user:any)=>{

      this.form.patchValue({

        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        is_active: user.is_active

      });

    });

}
    
  }
  

  save() {

  if(this.userId){

    this.usersService
      .update(
        this.userId,
        this.form.value
      )
      .subscribe({

        next: () => {

          alert('แก้ไขสำเร็จ');

          this.router.navigate([
            '/users'
          ]);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  else{

    this.usersService
      .create(this.form.value)
      .subscribe({

        next: () => {

          alert(
            'เพิ่มผู้ใช้สำเร็จ'
          );

          this.router.navigate([
            '/users'
          ]);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

}

goBack() {

  this.router.navigate([
    '/users'
  ]);

}

}