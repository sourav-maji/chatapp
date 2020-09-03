import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public error_message: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  navigateToChat() {
    this.router.navigateByUrl('/chat', { state: this.loginForm.value });
    console.log(this.loginForm.value);
  }

  public onSubmit() {
    // console.log(this.loginForm.get("email").value, this.loginForm.get('password').value);
    this.auth
      .login(
        this.loginForm.get('email').value,
        this.loginForm.get('password').value
      )
      .pipe(first())
      .subscribe(
        (result) => {
          alert('Log in Sucessfull');
          this.router.navigateByUrl('/chat');
        },
        (error) => {
          alert('Invalid User Id or Password');
          this.error_message = 'Invalid Credentials';
        }
      );
    // this.navigateToChat()
  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
}
