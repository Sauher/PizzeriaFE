import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../interfaces/CartItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { MessageService } from '../../../services/message.service';
import { order } from '../../../interfaces/order';
import { OrderItem } from '../../../interfaces/orderitem';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NumberFormatPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{

  constructor(
    private api:APIService,
    private auth:AuthService,
    private msg:MessageService,
    private cart: CartService
  ){}
  newOrder : order = {
    id: 0,
    user_id: 0,
    total: 0,
    status: false
  }
  items: CartItem[] = []
  currency: string = "Ft"
  allTotal = 0
  orderitems: CartItem[] = []

  ngOnInit(): void {
    this.getData()
    
  }
  getData(){
    this.api.SelectAll('carts_vt/userId/eq/' + this.auth.loggedUser()[0].id).then(res =>{
      this.items = res.data as CartItem[];
      this.allTotal = 0
      this.items.forEach(item => this.allTotal += item.total)
      console.log(this.items)
    })
  }
  emptycart(){
    if (confirm("Biztosan törölni szeretnéd?")){
      this.api.Delete('carts/userId/eq', this.auth.loggedUser()[0].id).then(res =>{
        
        if(res.status == 500){
            this.msg.show('danger','Hiba',res.message!)
            return
        }
          this.msg.show('success','OK',"Kosár ürítve!")
          this.getData()
        this.cart.clearCartCount()
      })
    }
  }
  update(item:CartItem){
    let data = {
      amount:item.amount,
    }
    this.api.Update('carts',item.id,data).then(res =>{
        
      if(res.status == 500){
          this.msg.show('danger','Hiba',res.message!)
          return
      }
      if(res.status == 200){
        this.msg.show('success','OK',res.message!)
        this.getData()
      }
    })
  }
  remove(id:number){
    if (confirm("Biztosan törölni szeretnéd?")){
      this.api.Delete('carts',id).then(res =>{
        
        if(res.status == 500){
            this.msg.show('danger','Hiba',res.message!)
            return
        }
          this.msg.show('success','OK',res.message!)
          this.getData()
          this.cart.refreshcartCount()
      })
    }
  }
  sendOrder(){
    this.newOrder.user_id = this.auth.loggedUser()[0].id
    this.newOrder.status = true
    this.newOrder.total = this.allTotal
    this.api.Insert('orders',this.newOrder).then(res =>{
      console.log(res.data)
      const orderId = res.data.insertId

      let promises: Promise<any>[] = []

      this.items.forEach(item=>{
        let orderItem: OrderItem= {
          order_id: orderId,
          pizza_id: item.pizzaId,
          quantity: item.amount,
          price: item.price
        }
       
        let p = this.api.Insert("order_items",orderItem).then(res=>{
          return this.api.Delete("carts",item.id)
        })
        promises.push(p)
      })
      Promise.all(promises).then(()=>{
        this.msg.show('success','OK',"Rendelésed sikeresen leadva!")
        this.sendOrderInfo(this.items, this.newOrder)
        this.getData()
        this.cart.clearCartCount()
      })


    })
    }
    sendOrderInfo(pizzas: CartItem[], orderInfo : order){
      let data = {
        to: this.auth.loggedUser()[0].email,
        subject: "Rendelés visszaigazolás!",
        template : "orderinfo",
        data: {
        pizzas,
        payment : orderInfo.payment,
        shipping : orderInfo.shipping,
        comment : orderInfo.comment,
        userName: this.auth.loggedUser()[0].username,
        phone: "423423",
        address:"Valahol"
        }
      }
      this.api.sendMail(data).then(res=>{
        console.log(res)
      })
    }
  }

