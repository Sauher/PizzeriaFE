import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIService } from '../../../services/api.service';
import { Pizza } from '../../../interfaces/pizza';
import { enviroment } from '../../../../enviroments/enviroment';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { bootstrapAppScopedEarlyEventContract } from '@angular/core/primitives/event-dispatch';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";
declare var bootstrap: any;

@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NumberFormatPipe
],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit{

//Lapozásos miújságok----
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedPizza:Pizza[] = []
//-----------------------





  formModal:any 
  confirmModal:any
  currency = enviroment.currency
  pizzas: Pizza[] = []
  editmode = false;
  
  pizza:Pizza = {
    id: 0,
    name: "",
    descrip: "",
    calories: 0,
    price: 0
  };

  constructor(
    private Api: APIService,
    private mess: MessageService
  ){}


  ngOnInit(): void {
    this.formModal = new bootstrap.Modal('#formModal')
    this.confirmModal = new bootstrap.Modal('#confirmModal')
    this.getPizzas()
  }  

  getPizzas(){
    this.Api.SelectAll('pizzas').then(res =>{
      this.pizzas = res.data
      this.totalPages = Math.ceil(this.pizzas.length/this.pageSize)
      this.setPage(1)
    })
  }

  setPage(page:number){
    
    this.currentPage = page;
    const startIndex = (page -1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPizza = this.pizzas.slice(startIndex,endIndex)
  }

  getPizza(id:number){
    this.Api.Select('pizzas', id).then(res =>{
      this.pizza = res.data[0];
      this.editmode = true;
      this.formModal.show();
    })
  }

  saveP(){

    if(!this.pizza.name  || !this.pizza.price || !this.pizza.calories){
      this.mess.show('danger','Hiba','Nem adtál meg minden adatot')
      
      return
    }
    if(this.editmode){
      this.Api.SelectAll('pizzas/name/eq' + this.pizza.name).then(res =>{
        if(res.data.length != 0 && res.data[0].id != this.pizza.id){
          this.mess.show('danger','Hiba',"Van már ilyen nevű pizzád!")
          return
        }
        this.pizza.image = ""
        this.Api.Update('pizzas',this.pizza.id,this.pizza).then(res =>{
          this.mess.show('success','Sikeres','A pizza sikeresen módosítva lett!')
          this.formModal.hide()
          this.editmode = false;
          this.pizza = 
          {
            id: 0,
            name: "",
            descrip: "",
            calories: 0,
            price: 0
          };
          this.getPizzas();
        })
      })
    }
    else{
      this.Api.SelectAll('pizzas/name/eq' + this.pizza.name).then(res =>{
        if(res.data.length != 0){
          this.mess.show('danger','Hiba',"Van már ilyen nevű pizzád!")
          return
        }
  
        this.Api.Insert('pizzas',this.pizza).then(res => {
          this.mess.show('success','Sikeres','A pizza sikeresen fel lett véve a listába!')
          this.formModal.hide();
          this.pizza = 
          {
            id: 0,
            name: "",
            descrip: "",
            calories: 0,
            price: 0
          };
          this.getPizzas();
        });
  
      })
    }
    
  
  }

  confirmDelete(id:number){
    this.pizza.id = id;
    this.confirmModal.show()
  }
  deleteP(id:number){
    this.Api.Delete('pizzas',id).then(res =>{
      this.mess.show('success','Törölve','A pizza sikeresen törölve lett!')
      this.confirmModal.hide();
      this.pizza = 
      {
        id: 0,
        name: "",
        descrip: "",
        calories: 0,
        price: 0
      }
      this.getPizzas()
    })
    
  }
}
