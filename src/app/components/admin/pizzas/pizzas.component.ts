import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIService } from '../../../services/api.service';
import { Pizza } from '../../../interfaces/pizza';
import { enviroment } from '../../../../enviroments/enviroment';

@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit{

  currency = enviroment.currency
  pizzas: Pizza[] = []
  
  constructor(
    private Api: APIService
  ){}


  ngOnInit(): void {
    this.getPizzas()
  }  

  getPizzas(){
    this.Api.SelectAll('pizzas').then(res =>{
      this.pizzas = res.data
    })
  }
}
