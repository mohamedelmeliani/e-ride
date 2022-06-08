import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { trajet } from 'src/assets/classes/trajet';

@Component({
    selector: 'app-listings-details',
    templateUrl: './listings-details.component.html',
    styleUrls: ['./listings-details.component.scss']
})
export class ListingsDetailsComponent implements OnInit {

    constructor(private active: ActivatedRoute,
        public sanitizer: DomSanitizer,
        public service: AuthService,
        private http: HttpClient,
        private router: Router) { }
    public id: string = this.active.snapshot.params['id'];
    public trajet: any = new trajet();
    showParticipate = false;
    showItsYou = false;
    showAlreadyIn = false;
    showSpinner = true;
    state = "";
    user: any = [];
    showApproved = false;
    showDenied = false;
    public profile: any;
    public assistes: any = [];
    public acceptedRequests=0;
    public requestsDone=false;
    public users: any = [];
    ngOnInit(): void {
        this.showSpinner = true;
        this.acceptedRequests=0;
        this.users = [];
        this.id = this.active.snapshot.params['id'];
        this.http.get(this.service.host + "/all/findtrajet/" + this.id).subscribe(
            res => {
                this.trajet = res;
                if (this.service.isAuthenticated) {
                    this.service.get("/user/profile").subscribe(data => {
                        this.profile = data;
                        this.assistes = this.trajet.assistes;
                        this.assistes.forEach(assiste => {
                            this.http.get(this.service.host + "/all/getUserById/" + assiste.key.userId).subscribe(
                                res => {
                                    this.user = res;
                                    this.user.showDenied = false;
                                    this.user.showApproved = false;
                                    this.user.requestsDone=false;
                                    if (this.user["id"] == this.profile.id) {
                                        this.showAlreadyIn = true;
                                        this.showParticipate = false;
                                        this.state = assiste.status;
                                    }
                                    if(this.acceptedRequests<this.trajet.nbrePlace){
                                        if (assiste.status==="Votre demande a été acceptée") {
                                            this.acceptedRequests++;
                                            this.user.showApproved = true;
                                            this.user.showDenied = false;
                                        } else if  (assiste.status==="Votre demande a été refusée"){
                                            this.user.showApproved = false;
                                            this.user.showDenied = true;
                                        } 
                                    }else{
                                        this.user.requestsDone=true;
                                    }
                                    console.log("aproved : " + this.user.showDenied + " denied : " + this.user.showDenied);
                                    console.log(this.user)
                                    this.users.push(this.user);
                                }
                            )
                        });
                        if (this.profile.id == this.trajet.car.owner.id) {
                            this.showItsYou = true;
                            this.showParticipate = false;
                        } else {
                            this.showItsYou = false;
                            this.showParticipate = true;
                        }
                        this.showSpinner = false;
                    });
                } else {
                    this.showItsYou = false;
                    this.showParticipate = false;
                    this.showSpinner = false;
                }
            }, err => {
                this.router.navigateByUrl("/trajet_not_found");
            }
        )
    }

    assisteRequest() {
        this.service.post("/user/addAssiste", this.trajet).subscribe(
            response => {
                this.ngOnInit();
            }
        )
    }

    modifyRequest(id: number, code: number) {
        this.service.put("/user/modifyAssiste/" + id + "?code=" + code, this.trajet).subscribe(
            response => {
                this.ngOnInit();
            }
        )
    }


}