import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  showCode = false;
  mdp = "";
  confirmMdp = "";
  email = this.active.snapshot.params['email'];
  code = this.active.snapshot.params['code'];
  showError = false;
  textError = "";
  showSpinner = false;
  username="";
  password="";

  constructor(private http: HttpClient, private service: AuthService, private active: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    try {
      this.email = atob(this.email);
      this.code = atob(this.code);
    } catch {
      this.router.navigateByUrl("/");
    }
    if (!this.isEmail(this.email) || (this.code + '').length != 6) {
      this.router.navigateByUrl("/");
    } else {
      this.http.get(this.service.host + "/all/verifyConfirmation/" + this.email + "?code=" + this.code).subscribe(
        res => {

        }, err => {
          this.router.navigateByUrl("/");
        }
      )
    }

  }

  change() {
    if ((this.mdp + '').length > 8) {
      this.showSpinner=true;
      this.http.post(this.service.host + "/all/changePasswordAfterConfirmation/" + this.email+ "?code=" + this.code, { "oldPassword": this.mdp, "newPassword": this.mdp }).subscribe(
        res => {
          this.username=this.email;
          this.password=this.mdp;
          this.Authenticate();
          this.router.navigateByUrl("/");
        }, err => {
          this.showError = true;
          this.textError = "Un error est produit durant le changement du mot de pass veulliez esseyer plus tard";
          this.showSpinner = false;
        }
      )
    }
  }


  isEmail(email) {
    var EmailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return EmailRegex.test(email);
  }

  Authenticate() {
    this.showSpinner = true;
    let body = new URLSearchParams();
    body.set('username', this.username);
    body.set('password', this.password);
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    this.http
      .post(this.service.host + "/login", body.toString(), options)
      .subscribe(response => {
        this.service.tokens = response;
        localStorage.clear();
        localStorage.setItem("refresh_token", this.service.tokens.refresh_token);
        localStorage.setItem("access_token", this.service.tokens.access_token);
        this.service.isAuthenticated = true;
        this.showSpinner = false;
      }, err => {
        this.service.isAuthenticated = false;
        this.showSpinner = false;
      });
  }

}
