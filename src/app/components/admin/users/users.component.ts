import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { enviroment } from '../../../../enviroments/enviroment';
import { APIService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { order } from '../../../interfaces/order';
import { Pizza } from '../../../interfaces/pizza';
declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
//Lapozásos miújságok----
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedUser:User[] = []
  //-----------------------
  
  selectedUser: User | null = null;
  selectedFile: File | null = null;
  
  orderAid:any
  pizzaFeltet: any
  formModal:any 
  extraModal:any
  confirmModal:any
  currency = enviroment.currency
  orders: order[] = []
  users: User[] = []
  pizzas: Pizza[] = []
  loggedUser : User = {
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
  }
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
    private mess: MessageService,
    private Auth: AuthService
  ){}


  ngOnInit(): void {
    this.formModal = new bootstrap.Modal('#infoModal')
    this.extraModal = new bootstrap.Modal('#extraModal')
    this.getUsers()
    this.loggedUser = this.Auth.loggedUser()[0];
  }  

  getUsers(){
    this.Api.SelectAll('users').then(res =>{
      this.users = res.data as User[]
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

  getUser(id:any){
    this.Api.Select('users', id).then(res =>{
      this.user  = res.data[0];
      this.selectedUser = res.data[0]

      this.Api.Select('orders/user_id/eq', id).then(res =>{
        this.orders = res.data,
        this.formModal.show()
        console.log(this.orders)
      })
      this.formModal.show();
    })
  }
  
  getPizza(id:any){
    console.log("ID: " + id)
    this.Api.getPizzaID('order_items','pizza_id',id).then(res=>{
      this.orderAid = res.data[0].pizza_id;
      console.log("RES DATA: " + this.orderAid)
      this.Api.Select('pizzas/id/eq',this.orderAid).then(res=>{
        this.pizzas = res.data,
        console.log(this.pizzas)
        this.extraModal.show()
      })
    })
  }

  banUser(id:any){
      let idx = this.users.findIndex(user => user.id == id)
      this.users[idx].status = !this.users[idx].status;
      this.Api.Update('users',id,{status:this.users[idx].status ? 1: 0})
  }

  cancel(){
    this.selectedUser = {
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
    }
    this.orders = [];
  }
}
