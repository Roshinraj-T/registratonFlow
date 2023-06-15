import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent {
  constructor(private fb:FormBuilder) { }

  reactiveForm=this.fb.group({
    email:[,[Validators.required,Validators.email]]
  })

  onSubmit(){
    console.log(this.reactiveForm.value);
  }

}
