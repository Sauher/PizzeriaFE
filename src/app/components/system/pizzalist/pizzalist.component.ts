import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { APIService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Pizza } from '../../../interfaces/pizza';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { MessageService } from '../../../services/message.service';
import { CartService } from '../../../services/cart.service';

@Component({

  
  selector: 'app-pizzalist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NumberFormatPipe,
    LightboxComponent
  ],
  templateUrl: './pizzalist.component.html',
  styleUrl: './pizzalist.component.scss'
})
export class PizzalistComponent implements OnInit{

  //Lapozásos miújságok----
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedPizza:Pizza[] = []
  //-----------------------
  setPage(page:number){
    
    this.currentPage = page;
    const startIndex = (page -1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPizza = this.pizzas.slice(startIndex,endIndex)
  }

  constructor(
    private api : APIService,
    private auth: AuthService,
    private message: MessageService,
    private cart : CartService
  ){}


  pizza:Pizza={
    id:0,
    name : "",
    descrip: "",
    image: "",
    calories: 0,
    price:0,
    amount:0
  }
  pizzas:Pizza[] =[]
  filteredPizzas:Pizza[] = []
  currency = "Ft"
  isloggedIn: boolean = false
  searchTerm:string = ""

  ngOnInit(): void {
    this.isloggedIn = this.auth.isLoggedUser()
    this.getPizzas()
  }
  getPizzas(){
    this.api.SelectAll('pizzas').then(res=>{
      this.pizzas = res.data
      this.pizzas.forEach(pizza => this.pizza.amount = 0)

      this.filteredPizzas = this.pizzas
    })

  }

  lightBoxVisible = false;
  lightBoxUrl = "";
  openLightBox(image:string){
    this.lightBoxUrl = image
    this.lightBoxVisible = true
  }

  filterPizzas(){
    const term =this.searchTerm.toLowerCase().trim();
    this.filteredPizzas = this.pizzas.filter(p => p.name.toLowerCase().includes(term) ||p.descrip?.toLowerCase().includes(term))
  }

  AddToCart(pizzaId: number){
    const pizza = this.pizzas.find(pizza =>pizza.id == pizzaId);
    const amount = pizza!.amount;

    if(amount == 0){
      this.message.show('danger','Hiba','Nulla pizzát nem bírsz rendelni!')
    }

    let data={
      userId: this.auth.loggedUser()[0].id,
      pizzaId: pizzaId,
      amount: amount  
    }
    pizza!.amount = 0
    this.api.SelectAll('carts/userId/eq/'+data.userId).then(res=>{
      console.log(res.data)
      let idx = -1
      if(res.data.length > 0){
        idx = res.data.findIndex((item:{pizzaId:number;}) => item.pizzaId ==data.pizzaId)
        console.log(idx)
      }
      if(idx > -1){
        data.amount = res.data[idx].amount + amount
        //Van már benne ilyen miújság
        this.api.Update('carts',res.data[idx].id, data).then(res => {
          this.message.show('success','Ok','A tétel darabszáma sikeresen módosítva!')
          return
        })

      }
      else{
        //Nincs még benne ilyen miújság
        this.api.Insert('carts',data).then(res=>{
          this.message.show('success','Ok','A tétel sikeresen hozzáadva a kosárhoz!')
          this.cart.refreshcartCount()
          return
        })
      }
    })
  }
}
