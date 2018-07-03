import { SavedImage } from './../../common/models/savedImage';
import { AzureToolkitService } from './../../common/services/azureToolkit.service';
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
  savedImages: SavedImage[] | null = null;
  searchResults: SavedImage[] | null;

  constructor(private userService: UserService, private azureToolkitService: AzureToolkitService) { }

  ngOnInit(): void {
    this.user = { userId: "Vedran", firstName: "Vedran", lastName: "Mandić" };
    //this.userService.getUser().subscribe(user => this.user = user );

    this.azureToolkitService.getImages(this.user.userId).subscribe(images => {
      this.savedImages = images;
    });
  }

  search(searchTerm: string) {
    this.searchResults = null;

    this.azureToolkitService
      .searchImage(this.user.userId, searchTerm)
      .subscribe(result => {
        this.searchResults = result;
      });
  }
}