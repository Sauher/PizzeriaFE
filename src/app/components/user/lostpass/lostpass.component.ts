import { Component } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { APIService } from '../../../services/api.service';


@Component({
  selector: 'app-lostpass',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './lostpass.component.html',
  styleUrl: './lostpass.component.scss'
})
export class LostpassComponent {
    constructor(
      private api: APIService
    ){}
  ResetP(){

  }
}
