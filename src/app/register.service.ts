import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  url="http://localhost:2500";

  registerUser(data:any){
    return this.http.post(this.url+"/signUp",data);
  }

  verifyEmail(token:string|null){
    return this.http.put(this.url+`/verify/${token}`,"");
  }

  addPassword(body:any){
    return this.http.put(this.url+`/addPassword`,body)
  }
}
