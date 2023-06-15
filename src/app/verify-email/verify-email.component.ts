import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {

  constructor(private activatedRoute:ActivatedRoute,private service:RegisterService) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.queryParams['token']){

      let token=this.activatedRoute.snapshot.queryParams['token'];
      console.log(token,"token");
    }
    
    // this.service.verifyEmail(token).subscribe((res:any)=>{
    //   console.log(res,"res");
    // });

  }
}
