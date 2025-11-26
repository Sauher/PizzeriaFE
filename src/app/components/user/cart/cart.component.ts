import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../interfaces/CartItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';

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
    private auth:AuthService
  ){}

  items: CartItem[] = []
  currency: string = "Ft"
  allTotal = 0

  ngOnInit(): void {
    this.api.SelectAll('carts_vt/userId/eq/' + this.auth.loggedUser()[0].id).then(res =>{
      this.items = res.data as CartItem[];
      this.items.forEach(item => this.allTotal += item.total)
    })
  }
}
