import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {LayoutService} from "../../layout/layout.service";
import { Router } from '@angular/router';

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  public user:any;

  constructor(
    private userService: UserService, private layoutService: LayoutService, private router: Router) {
  }

  ngOnInit() {
    this.userService.getLoginInfo().subscribe(user => {
      this.user = user;
    })

  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

  navigateToProfile() {
    this.router.navigate(['/profile'])
  }

}
