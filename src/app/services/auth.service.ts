import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { enviroment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenName = enviroment.tokenName

  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();
  constructor() { }

  hasToken():boolean{
    const sessST = sessionStorage.getItem(this.tokenName)
    if(sessST)return true;
    const locST = localStorage.getItem(this.tokenName)
    if(locST){
      sessionStorage.setItem(this.tokenName,locST)
      return true
    } 
    return false;
  }

  storeUser(token:string){
    localStorage.setItem(this.tokenName,token)
  }

  login(token:string){ //TODO: Token majdan valamikor stringgé cseperedik~
    sessionStorage.setItem(this.tokenName, token)
    this.isLoggedIn.next(true)
  }
  logout(){
    sessionStorage.removeItem(this.tokenName)
    localStorage.removeItem(this.tokenName)
    this.isLoggedIn.next(false)
  }

  loggedUser(){
    const token = sessionStorage.getItem(this.tokenName);
    if(token){
      return JSON.parse(token);
    }
    return null;
  }
  isAdmin():boolean{
    const user = this.loggedUser();
    if(user)return user[0].role === 'admin';
    return false;
  }
  isLoggedUser():boolean {
    return this.isLoggedIn.value;
  }
  
}
