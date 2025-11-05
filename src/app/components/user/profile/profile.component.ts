import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIService } from '../../../services/api.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    constructor(
      private api: APIService
    ){}
  profUpdate(){}
}
