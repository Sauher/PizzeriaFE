import { Component } from '@angular/core';
import { User } from '../../../interfaces/user';
import { enviroment } from '../../../../enviroments/enviroment';
import { APIService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
//Lapozásos miújságok----
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedUser:User[] = []
  //-----------------------
  
  
  selectedFile: File | null = null;
  
  
  formModal:any 
  confirmModal:any
  currency = enviroment.currency
  users: User[] = []
  editmode = false;
  
  user:User = {
    id: 0,
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "",
    phone: "",
    address: "",
    reg: "",
    lastLog: "",
    status: false
  };

  constructor(
    private Api: APIService,
    private mess: MessageService
  ){}


  ngOnInit(): void {
    this.formModal = new bootstrap.Modal('#infoModal')
    this.getUsers()
  }  

  getUsers(){
    this.Api.SelectAll('users').then(res =>{
      this.users = res.data
      this.totalPages = Math.ceil(this.users.length/this.pageSize)
      this.setPage(1)
    })
  }

  setPage(page:number){
    
    this.currentPage = page;
    const startIndex = (page -1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUser = this.users.slice(startIndex,endIndex)
  }

  getUser(email:string){
    this.Api.SelectEmail('users', email).then(res =>{
      this.user = res.data[0];
      this.formModal.show();
    })
  }
}
