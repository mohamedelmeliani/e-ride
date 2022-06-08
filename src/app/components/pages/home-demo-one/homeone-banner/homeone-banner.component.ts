import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-homeone-banner',
    templateUrl: './homeone-banner.component.html',
    styleUrls: ['./homeone-banner.component.scss']
})
export class HomeoneBannerComponent implements OnInit {

    constructor(private http: HttpClient,private router: Router) { }

    public options = [];
    public options2 = [];
    public villeD: string;
    villeA="";
    public Dt: Date;

    ngOnInit(): void {
        this.http.get('https://morocco-test-1.herokuapp.com/regions/search/ville?ville=').subscribe(
            data => {
                this.options = data['_embedded'].villes;
                this.options2=this.options;
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
        this.villeD=$event.value.ville;
        this.options=this.options2;
        this.options=this.options.filter(el => el.ville != this.villeD);
    }
    selectionChanged2($event) {
        this.villeA=$event.value.ville;
        this.options=this.options2;
        this.options=this.options.filter(el => el.ville != this.villeA);
    }
    selectionChanged3($event) {
        this.Dt=$event.target.value;
        console.log($event.target.value);
    }
    reset() {
        this.resetOption = [];
    }

    onSearch(data:any){
        if(this.villeA==""||this.villeD==""||this.Dt==undefined){
            return false;
        }
        else{
            this.router.navigateByUrl("/recherche;villeD="+this.villeD+";villeA="+this.villeA+";date="+this.Dt);
        }
    }
}