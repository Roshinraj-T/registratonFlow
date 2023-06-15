import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  
  constructor(private fb:FormBuilder) { }

  reactiveForm=this.fb.group({
    password:[,[Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/')]],
    cPassword:[,[Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/')]]

  })

  onSubmit(){
    console.log('Reset Password');
  }
}
