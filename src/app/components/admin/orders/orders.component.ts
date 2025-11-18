import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { enviroment } from '../../../../enviroments/enviroment';
import { APIService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";
import { AuthService } from '../../../services/auth.service';
import { order } from '../../../interfaces/order';
declare var bootstrap: any;

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule,    NumberFormatPipe,],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedOrder:order[] = []
  //-----------------------
  
  selectedUser: User | null = null;
  orders: order[] = []
  users:User[] = []
  selectedFile: File | null = null;
  
  
  formModal:any 
  confirmModal:any
  currency = enviroment.currency
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
  order:order={
    id:0,
    user_id:0,
    total:0,
    status:false
  }

  constructor(
    private Api: APIService,
    private mess: MessageService,
    private Auth: AuthService
  ){}


  ngOnInit(): void {
    this.formModal = new bootstrap.Modal('#infoModal')
    this.getOrders()
    this.loggedUser = this.Auth.loggedUser()[0];
  }  

  getOrders(){
    this.Api.SelectAll('orders').then(res =>{
      this.orders = res.data as order[]
      this.totalPages = Math.ceil(this.orders.length/this.pageSize)
      this.setPage(1)
    })
  } 

  setPage(page:number){
    
    this.currentPage = page;
    const startIndex = (page -1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedOrder = this.orders.slice(startIndex,endIndex)
  }

  getOrder(id:any){
    this.Api.Select('orders', id).then(res =>{
      this.order  = res.data[0];
      this.selectedUser = res.data[0]

      this.Api.Select('users/id/eq', id).then(res =>{
        this.users = res.data,
        this.formModal.show()
        console.log(this.user)
      })
      this.formModal.show();
    })
  }
  
  CompleteOrder(id:any){
    let idx = this.orders.findIndex(order => order.id == id)
    this.orders[idx].status = !this.orders[idx].status;
    this.Api.Update('orders',id,{status:this.orders[idx].status ? 1: 0})

  }

  UndoOrder(id:any){
    if(confirm("Biztosan vissza akarod vonni?")){
      this.CompleteOrder(id)
    }
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
