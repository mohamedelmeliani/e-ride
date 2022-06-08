import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
    selector: 'app-grid-listings-full-width',
    templateUrl: './grid-listings-full-width.component.html',
    styleUrls: ['./grid-listings-full-width.component.scss']
})
export class GridListingsFullWidthComponent implements OnInit {

    constructor(private http: HttpClient, private active: ActivatedRoute, public service: AuthService,
        public sanitizer: DomSanitizer, private router: Router) {
        this.villeA = this.active.snapshot.params["villeA"];
        this.villeD = this.active.snapshot.params["villeD"];
        this.Dt = this.active.snapshot.params["date"];
    }

    public options = [];
    public options2 = [];
    public trajets: any = [];
    public villeD: "";
    villeA = "";
    public Dt: "";
    showSpinner = true;

    ngOnInit(): void {
        this.http.get('https://morocco-test-1.herokuapp.com/regions/search/ville?ville=').subscribe(
            data => {
                this.options = data['_embedded'].villes;
                this.options2 = this.options;
            }
        )
        this.active.params.subscribe(
            res => {
                this.showSpinner = true;
                let data = {
                    "villeA": this.villeA,
                    "villeD": this.villeD,
                    "date": this.Dt
                }
                this.http.post(this.service.host + "/all/gettrajets", data).subscribe(
                    res => {
                        this.trajets = res;
                        this.showSpinner = false;
                    }
                )
            }
        )
    }


    // Category Select
    singleSelect: any = [];
    multiSelect: any = [];
    stringArray: any = [];
    objectsArray: any = [];
    resetOption: any;
    config = {
        displayKey: "ville",
        placeholder: "Ville d'arrive",
        search: true,
        moreText: 'Plus',
        noResultsFound: 'Ville Introuvable!',
        searchPlaceholder: 'Chercher'
    };
    config1 = {
        displayKey: "ville",
        placeholder: "Ville de depart",
        search: true,
        moreText: 'Plus',
        noResultsFound: 'Ville Introuvable!',
        searchPlaceholder: 'Chercher'
    };


    selectionChanged1($event) {
        this.villeD = $event.value.ville;
        this.options = this.options2;
        this.options = this.options.filter(el => el.ville != this.villeD);
    }
    selectionChanged2($event) {
        this.villeA = $event.value.ville;
        console.log(this.villeA);
    }
    selectionChanged3($event) {
        console.log($event.target.value);
    }
    reset() {
        this.resetOption = [];
    }

    onSearch(data: any) {
        if (this.villeA == "" || this.villeD == "" || this.Dt == undefined) {
            return false;
        }
        else {
            this.router.navigateByUrl("/recherche;villeD=" + this.villeD + ";villeA=" + this.villeA + ";date=" + this.Dt);
        }
    }

}