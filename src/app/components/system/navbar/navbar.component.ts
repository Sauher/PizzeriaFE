import { Component, Input, OnInit } from '@angular/core';
import { NavItem } from '../../../interfaces/navitem';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgFor,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
    @Input() title = '';

    isLoggedIn = false;
    isAdmin = false;
    loggedUserName = '';
    cartCount = 0
    constructor(
      private auth: AuthService,
      private cart: CartService
    ){}

    navItems:NavItem[] = []

    ngOnInit():void{
      this.auth.isLoggedIn$.subscribe(res =>{
        this.isLoggedIn = res
        this.isAdmin = this.auth.isAdmin()
        
        if(this.isLoggedIn){
          this.loggedUserName = this.auth.loggedUser()[0].name;
          this.cart.refreshcartCount();

          this.cart.cartCount$.subscribe(count =>{
            this.cartCount = count
            this.setupMenu(res);
          })
        }
        else{
          this.loggedUserName = ""
          this.cartCount = 0
          this.setupMenu(false)
        }
        
      })
    }

    setupMenu(isLoggedIn:Boolean){
      this.navItems=[
        {
          name: 'PizzaLista',
          icon: 'bi-card-list',
          url:'pizzalist'
        },
        ...(this.isLoggedIn)?[
        {
          name: 'Kosár',
          icon: 'bi-cart',
          url:'cart',
          badge: this.cartCount
        },
        ...(this.isAdmin) ? [
          {
            name: 'Pizzák kezelése',
            icon: 'bi-database',
            url:'pizzas'
          },
          {
            name: 'Felhasználók kezelése',
            icon: 'bi-people',
            url:'users'
          },
          {
            name: 'Rendelések kezelése',
            icon: 'bi-receipt',
            url:'orders'
          },
          {
            name: 'Statisztika',
            icon: 'bi-graph-up-arrow',
            url:'stats'
          },
        ] : [
          {
            name: 'Rendeléseim',
            icon: 'bi-receipt',
            url:'myorders'
          },
        ], 
        {
          name: 'Profil',
          icon: 'bi-people-fill',
          url:'profile'
        },
        {
          name: 'Kilépés',
          icon: 'bi-box-arrow-left',
          url:'logout'
        },
      ] : [
        {
          name: 'Regisztráció',
          icon: 'bi-person-add',
          url:'registration'
        },
        {
          name: 'Belépés',
          icon: 'bi-box-arrow-in-right',
          url:'login'
        },
      ]
      ]
    }
}
