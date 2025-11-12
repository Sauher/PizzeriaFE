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
import { LightboxComponent } from '../../system/lightbox/lightbox.component';
declare var bootstrap: any;

@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NumberFormatPipe,
    LightboxComponent
],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit{

  lightBoxVisible = false;
  lightBoxUrl = "";

//Lapozásos miújságok----
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedPizza:Pizza[] = []
  //-----------------------
  
  
  selectedFile: File | null = null;
  
  
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

  async saveP(){

    if(!this.pizza.name  || this.pizza.price == 0|| this.pizza.calories == 0){
      this.mess.show('danger','Hiba','Nem adtál meg minden adatot')
      
      return
    }
      if(this.selectedFile){
        const formData = new FormData();
        formData.append('image',this.selectedFile)
        const res = await this.Api.upload(formData).then(res=>{
          if(res.status != 200){
            this.mess.show('danger','Hiba',res.message!)
          }
          else{
            this.pizza.image = res.data.filename;
          }
          
        })
      }

    if(this.editmode){
      this.Api.SelectAll('pizzas/name/eq/' + this.pizza.name).then(res =>{
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
      this.Api.SelectAll('pizzas/name/eq/' + this.pizza.name).then(res =>{  
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
    let pizza = this.pizzas.find(item => item.id == id)
    if(pizza && pizza?.image != ''){
      this.Api.deleteImage(pizza.image!)
    }
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


  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
    
  }

  deleteImage(id:number, filename:string){
    this.Api.deleteImage(filename).then(res =>{
      if(res.status == 200){  
        this.pizza.image = ""
        this.Api.Update('pizzas',id,this.pizza).then(res =>{
          this.mess.show('success','Ok','A kép törölve')
        })
      }
    })
  }

  openLightBox(image:string){
    this.lightBoxUrl = image
    this.lightBoxVisible = true
  }

  cancel(){
    this.pizza=
    {
      id: 0,
      name: "",
      descrip: "",
      calories: 0,
      price: 0
    }
  }
}
