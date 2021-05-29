import { $animations } from './login-animations';
import { $providers } from './login-providers';
import { $pages } from './login-pages';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export type loginAction = 'register'|
'signIn'|'forgotPassword'|'changePassword'|
'changeEmail'|'delete'|'signOut';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: $animations
})
export class LoginComponent {

    readonly providers = $providers;
    private pages = $pages;
    
    private page: loginAction;
    private code: string;
  
    readonly form: FormGroup;
    private name: FormControl;
    private email: FormControl;
    private password: FormControl;
    private newEmail: FormControl;
    private newPassword: FormControl;
  
    public hidePassword = true;
    public error = null;
    public progress = false;

    //get auth() { return this.profile.auth; }

    constructor(
        private ref: MatDialogRef<LoginComponent>,
        @Inject(MAT_DIALOG_DATA) private action: loginAction) {
        // Form controls
        this.name = new FormControl(null, Validators.required);
        this.email = new FormControl(null, [Validators.required, Validators.email]);
        this.password = new FormControl(null, Validators.required);
        this.newEmail = new FormControl(null, [Validators.required, Validators.email]);
        this.newPassword = new FormControl(null, Validators.required);

        // Empty form group
        this.form = new FormGroup({});

        // Populates the form according to the page
        this.switchPage(this.page = action);
    }

    get currentPage() { return this.pages[this.page || 'signIn']; }

    close() {
        this.ref.close();
    }

   /**
    * Switches a page in the login form
    * @param page Page to switch to
    */
    private switchPage(page: loginAction) {

        // Removes all the controls from the form group
        Object.keys(this.form.controls).forEach( control => {
          this.form.removeControl(control);
        });
        // Add the relevant controls to the form according to selected page
        switch(this.page = page) {
          case 'register':
            this.form.addControl('name', this.name);
            this.form.addControl('email', this.email);
            this.form.addControl('password', this.password);
          break;
          default:
          case 'signIn':
            this.form.addControl('email', this.email);
            this.form.addControl('password', this.password);      
          break;
          case 'forgotPassword':
            this.form.addControl('email', this.email);
          break;
          /*
            case 'resetPassword':
            this.form.addControl('newPassword', this.newPassword);
            break;
          */
          case 'changePassword':
            this.form.addControl('password', this.password);
            this.form.addControl('newPassword', this.newPassword);
          break;
          case 'changeEmail':
            this.form.addControl('password', this.password);
            this.form.addControl('newEmail', this.newEmail);
          break;
          case 'delete':
            this.form.addControl('password', this.password);      
          break;
        }
    }

    private showError(error: string) {

        this.error = error;
        this.progress = false;
        setTimeout(() => this.error = null, 5000);
    }
    
    /**
     * Run an action based on user input
     * @param action An action
     */
    public activate(action: loginAction) {
    
        this.progress = true;
        
        switch(action) {
    
            default:
            case 'signIn':
            this.signIn( this.email.value, this.password.value );
            break;
    
            case 'register':
            this.registerNew( this.email.value, this.password.value, this.name.value );
            break;
            
            case 'forgotPassword':
            this.forgotPassword( this.email.value );
            break;
            /*
                  case 'resetPassword':
                  this.resetPassword( this.code, this.newPassword.value );
                  break;
            */
            case 'changePassword':
            this.updatePassword( this.password.value, this.newPassword.value );
            break;
            
            case 'changeEmail':
            this.updateEmail( this.password.value, this.newEmail.value );
            break;
            
            case 'delete':
            this.deleteAccount( this.password.value );
            break;
        }
    }
    
    private registerNew(email: string, password: string, name: string) {
        // Registering a new user with a email/password
        /*this.auth.registerNew(email, password, name )
            // Creates the new user profile
            .then( user => this.profile.register(user)
            // Closes the dialog returning the user
            .then( () => this.ref.close(user) )
          )
            // Dispays the error code, eventually
            .catch( error => this.showError(error.code) );*/
    }
    
    private signIn(email: string, password: string) {
        // Sign-in using email/password
        /*this.auth.signIn(email, password)
            // Closes the dialog returning the user
            .then( user => this.ref.close(user) )
            // Dispays the error code, eventually
            .catch( error => this.showError(error.code) );*/
    }
    
    /*private signInWith(provider: string) { 
        // Signing-in with a provider    
        this.auth.signInWith( provider )
            // Creates the new user profile if needed, keeps the existing one otherwise
            .then( user => this.profile.register(user)
            // Closes the dialog returning the user
            .then( () => this.ref.close(user) )
          )
            // Dispays the error code, eventually
            .catch( error => this.showError(error.code) );
    }*/
    
    private forgotPassword(email: string) {
    
        /*this.auth.sendPasswordResetEmail(email)
            // Closes the dialog returning null
            .then( () => this.ref.close(null) )
            // Dispays the error code, eventually
            .catch( error => this.showError(error.code) );*/
    }
    /*
      private resetPassword(code: string, newPassword: string) {
        
        this.auth.confirmPasswordReset(code, newPassword)
          //.then( () => this.reportSuccess('Reset to a new password', 'signIn') )
          // Dispays the error code, eventually
          .catch( error => this.showError(error.code) );
      }
    */
      
    private updateEmail(password: string, newEmail: string) {
        // Refreshes the authentication
        /*this.auth.refresh(password)
            // Updates the email returning the new user object
            .then( user => user.updateEmail(newEmail).then( () => this.ref.close(user) ) )
            // Dispays the error code, eventually
            .catch( error => this.showError(error.code) );*/
    }
    
    private updatePassword(password: string, newPassword: string) {
        // Refreshes the authentication
        /*this.auth.refresh(password)
            // Updates the password returning the new user object
            .then( user => user.updatePassword(newPassword).then( () => this.ref.close(user) ) )
            // Dispays the error code, eventually
            .catch( error => this.showError(error.code) );*/
    }
    
    private deleteAccount(password: string) {
        // Refreshes the authentication
        /*this.auth.refresh(password)
             // Deletes the user profile first
            .then( user => this.profile.delete()
              // Deletes the user object next
              .then( () => user.delete() )
            )
            // Closes the dialog returning null
            .then( () => this.ref.close(null) )
            // Dispays the error code, eventually
            .catch( error => this.showError(error.code) );*/
    }
}
