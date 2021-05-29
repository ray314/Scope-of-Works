import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  /**
   * Open the login dialog
   */
  openLoginDialog() {
      const dialogConfig = new MatDialogConfig();

      // User will not be able to close dialog by just clicking out of it.
      dialogConfig.disableClose = true; 
      // This will focus automatically on the first form field of the dialog.
      dialogConfig.autoFocus = true;

      dialogConfig.data = {
          id: 1,
          title: 'Sign in'
      };

      // Open the dialog with the above configurations
      this.dialog.open(LoginComponent, dialogConfig);
  }

  ngOnInit(): void {
      
  }

}
