import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { EncryptDecryptService } from '../services/encrypt-decrypt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  isSubmitted = false;
  message: any = null;
  loading = false;
  newInfo = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private encryptDecryptService: EncryptDecryptService,
    private spinner: NgxSpinnerService
  ) {
    let userinfo =  localStorage.getItem('currentUser');
    console.log(userinfo)
    if(userinfo !='' &&  userinfo != null) {
      location.href = '/dashboard'
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      type:['', Validators.required],
    });
  }


  get errorControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.message = null;
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();
    this.authenticationService.login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response)
          this.newInfo = {
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            gender: response.data.gender,
            id: response.data.id,
            image: response.data.image,
            status: response.data.status,
            type: response.data.type,
            remember_token: response.data.remember_token,
            designaion: response.data.designation,
            name: response.data.name
          }
          let permisssions = response.data.permission;
          this.encryptDecryptService.encryptionHandler(permisssions)
          localStorage.setItem('currentUser', JSON.stringify(this.newInfo));
          //location.reload();
          location.href = '/dashboard'
         // window.location = url;
        },
        (error) =>{
          this.spinner.hide();
          this.message = "Please Check Your Email Password and User Type";
        }
      );
    return;
  }
}
