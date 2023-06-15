import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  url="http://localhost:3000/userdetails";

  registerUser(data:any){
    return this.http.post(this.url+"/signup",data);
  }

  verifyEmail(token:string|null){
    return this.http.put(this.url+'/verify/',{token:token});
  }

  addPassword(body:any){
    return this.http.put(this.url+'/updatePassword',body)
  }
}
