import { UserService } from './../../common/services/userService';
import { Component, OnInit } from '@angular/core';
import { User } from '../../common/models/user';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user = { userId: "Vedran", firstName: "Vedran", lastName: "Mandić" };
    //this.userService.getUser().subscribe(user => this.user = user );
  }
}