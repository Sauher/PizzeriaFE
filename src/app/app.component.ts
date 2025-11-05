import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/system/header/header.component';
import { FooterComponent } from './components/system/footer/footer.component';
import { NavbarComponent } from './components/system/navbar/navbar.component';
import { MessageComponent } from './components/system/message/message.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent,NavbarComponent,MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  appTitle = 'Türr Pizzeria';
  subtitle = "A legjobb Türrös pizzéria"
  company = "Bajai SZC Türr Istvén Technikum";
  author = "13.A szoftverfejlesztő"
}
