import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getpass',
  templateUrl: './getpass.component.html',
  styleUrls: ['./getpass.component.css']
})
export class GetpassComponent {
  constructor(private fb:FormBuilder,private service:RegisterService,private router:Router) { }

  reactiveForm=this.fb.group({
    password:[,[Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/')]]
  })

  ngOnInit(){
  }
  onSubmit(){

    let token= localStorage.getItem('token');
    
    let body={password:this.reactiveForm.value["password"],token:token}

    this.service.addPassword(body).subscribe((data:any)=>{
      if(data.status){
        console.log(data.message);
        this.router.navigate(['login'])
      }
    })

    localStorage.clear();
    
    // this.service.addPassword(this.reactiveForm.value)
  }
}
