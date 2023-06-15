import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  reactiveForm:any;
  constructor(private builder:FormBuilder,private service:RegisterService,private router:Router){
    this.reactiveForm=builder.group({
      userName:[],
      email:[],
      // password:[]
    })
  }
  ngOnInit() {}

  onSubmit(){
    this.service.registerUser(this.reactiveForm.value).subscribe((res:any)=>{
      console.log(res,"res");
      if(res.status){
        this.router.navigate(['verifyUser']);
      }

    });
  }
}
