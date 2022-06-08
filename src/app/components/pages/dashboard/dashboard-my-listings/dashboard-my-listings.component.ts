import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
    selector: 'app-dashboard-my-listings',
    templateUrl: './dashboard-my-listings.component.html',
    styleUrls: ['./dashboard-my-listings.component.scss']
})
export class DashboardMyListingsComponent implements OnInit {


    showSpinner = true;
    showModalSpinner = true;
    public trajets: any = [];
    public trajet: any;
    public cars: any = [];
    public id: any;
    public selectedCar: any;
    public showError = false;
    public hasAssitses=false;
    public showSuccess = false;
    villeD: any = [];
    villeA: any = [];
    errorText: string;

    constructor(private service: AuthService, private router: Router, private http: HttpClient) { }

    ngOnInit(): void {
        this.showSpinner = true;
        this.resetOption = [this.options[0]];
        this.service.get("/user/loadTrajetsOfLogged").subscribe(
            res => {
                this.trajets = res;
                this.service.get("/user/findCarsOfLoggedUser").subscribe(
                    data => {
                        this.cars = data;
                        this.showSpinner = false;
                    }
                )
            }
        )
    }
    passId(id: any) {
        this.id = id;
    }

    deleteTrajet() {
        this.service.delete("/user/deleteTrajet/" + this.id).subscribe(
            res => {
                document.getElementById('close').click();
                this.id = undefined;
                this.ngOnInit();
            }
        )
        console.log(this.id);
    }

    getTrajet(id: any) {
        this.showModalSpinner = true;
        this.service.get("/all/findtrajet/" + id).subscribe(
            res => {
                this.trajet = res;
                if(this.trajet.assistes.length>0){
                    this.hasAssitses=true;
                }
                this.http.get("http://api.openweathermap.org/geo/1.0/direct?q=" + this.trajet.villeD + ",MA&appid=e53301e27efa0b66d05045d91b2742d3").subscribe(
                    data => {
                        this.villeD.lat = data[0].lat;
                        this.villeD.lon = data[0].lon;
                        if (Object.keys(this.villeD).length == 2 && Object.keys(this.villeA).length == 2 && this.trajet.nbrePlace && this.trajet.car) {
                            this.getDistance();
                        }
                        this.http.get("http://api.openweathermap.org/geo/1.0/direct?q=" + this.trajet.villeA + ",MA&appid=e53301e27efa0b66d05045d91b2742d3").subscribe(
                            data => {
                                this.villeA.lat = data[0].lat;
                                this.villeA.lon = data[0].lon;
                                if (Object.keys(this.villeD).length == 2 && Object.keys(this.villeA).length == 2 && this.trajet.nbrePlace && this.trajet.car) {
                                    this.getDistance();
                                }
                            }
                        )
                    }
                )
                this.showModalSpinner = false;
            }
        )
    }
    onSearch(data: any) {
        this.showError = false;
        this.showSuccess = false;
        this.showSuccess = false;
        this.showModalSpinner = true;
        if (data.villeD.length == 0 || data.villeA.length == 0 || data.car.length == 0) {
            this.showError = true;
            this.errorText = "Verifier les informations donnés";
        } else {
            this.service.put("/user/modifyTrajet/" + this.trajet.id, data).subscribe(
                res => {
                    this.showSuccess = true;
                    this.showModalSpinner = false;
                    this.ngOnInit();
                }, err => {
                    this.showError = true;
                    this.errorText = "Error lors de la modification";
                    this.showModalSpinner = false;
                }
            )
        }
    }

    config = {
        displayKey: "mat",
        placeholder: "Voiture",
        search: true,
        moreText: 'Plus',
        noResultsFound: 'Voiture Introuvable!',
        searchPlaceholder: 'Chercher'
    };

    breadcrumb = [
        {
            title: 'My Listings',
            subTitle: 'Dashboard'
        }
    ]

    pageTitleContent = [
        {
            title: 'Find Popular Places'
        }
    ]

    // Category Select
    singleSelect: any = [];
    multiSelect: any = [];
    stringArray: any = [];
    objectsArray: any = [];
    resetOption: any;
    options = [
        // Type here your category name
        {
            name: "Restaurants",
        },
        {
            name: "Events",
        },
        {
            name: "Clothing",
        },
        {
            name: "Bank",
        },
        {
            name: "Fitness",
        },
        {
            name: "Bookstore",
        }
    ];

    selectionChanged3($event) {
        console.log($event.value);
        var input = document.getElementById("nbrePlace");
        input.setAttribute("max", $event.value.nbrePlace);
    }
    reset() {
        this.resetOption = [];
    }
    // Ordering Select
    options2 = [
        {
            name: "Recommended",
        },
        {
            name: "Default",
        },
        {
            name: "Popularity",
        },
        {
            name: "Latest",
        },
        {
            name: "Price: low to high",
        },
        {
            name: "Price: high to low",
        }
    ];
    gridListings: number = 1;

    getDistance() {
        this.http.get("https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=" + this.villeD.lat + "," + this.villeD.lon + "&destinations=" + this.villeA.lat + "," + this.villeD.lon + "&travelMode=driving&key=Aq3iOntrQ2c51_IkDfd4p02TlaMUhYFSssc_nTImw4OE8FMuVOakwJeLkILGywGY").
            subscribe(
                data => {
                    var input = document.getElementById("prix");
                    var distance = data["resourceSets"][0].resources[0].results[0].travelDistance;
                    input.setAttribute("max", (distance / this.trajet.nbrePlace).toString());
                }
            )
    }

}