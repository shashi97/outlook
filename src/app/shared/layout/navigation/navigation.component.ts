import {Component, OnInit} from '@angular/core';
import {LoginInfoComponent} from "../../user/login-info/login-info.component";
import {AuthService} from '../../../+auth/auth.service';
import { JsonApiService } from "app/core/api/json-api.service";


@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {

  user: any;

  // Pinned Campaigns
  pinnedCampaigns = [];



  constructor(private authService: AuthService, private jsonApiService: JsonApiService) {
    
  }

  ngOnInit() {
    this.user = this.authService.getClaims();

    this.jsonApiService.fetch('/campaigns/pinned').subscribe(data=> {
      this.pinnedCampaigns = data;    })
  }

}
