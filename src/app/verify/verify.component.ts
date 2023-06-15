import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {

  visible=false;

  constructor(private activatedRoute:ActivatedRoute,private service:RegisterService,private router:Router) { }

  ngOnInit() {
    let token=this.activatedRoute.snapshot.paramMap.get('token');
    this.service.verifyEmail(token).subscribe((data:any)=>{
      if(data.status){
        this.visible=true;
        localStorage.setItem("token",data.data)
      }      
    })
  }

  onSubmit(){
    this.router.navigate(['addPassword']); 
  }
}
