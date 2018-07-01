import { User } from './../../common/models/user';
import { UserService } from './../../common/services/userService';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    user: User | null = null;

    ngOnInit(): void {
        // this.userService.getUser().subscribe(user => this.user = user);
    }
    constructor(private userService: UserService) {

    }
}
