import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { trajet } from 'src/assets/classes/trajet';

@Component({
  selector: 'app-dashboard-sidemenu',
  templateUrl: './dashboard-sidemenu.component.html',
  styleUrls: ['./dashboard-sidemenu.component.scss']
})
export class DashboardSidemenuComponent implements OnInit {

  public cars: any = [];
  public options = [];
  public options2 = [];
  showSpinner = true;
  showError = false;
  showSuccess=false;
  errorText = "";
  villeD: any = [];
  villeA: any = [];
  letPrice = false;
  trajet: any = new trajet();
  constructor(public service: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.http.get('https://morocco-test-1.herokuapp.com/regions/search/ville?ville=').subscribe(
      data => {
        this.options = data['_embedded'].villes;
        this.options2 = this.options;
        this.showSpinner = false;
      }
    )
  }

  initTrajet() {
    this.showSpinner = true;
    this.trajet = new trajet();
    this.showError = false;
    this.service.get("/user/findCarsOfLoggedUser").subscribe(
      data => {
        this.cars = data;
        this.showSpinner = false;
      }
    )
  }
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
  config2 = {
    displayKey: "mat",
    placeholder: "Voiture",
    search: true,
    moreText: 'Plus',
    noResultsFound: 'Voiture Introuvable!',
    searchPlaceholder: 'Chercher'
  };

  selectionChanged1($event) {
    this.showError = false;
    this.trajet.villeD = $event.value.ville;
    this.options = this.options2;
    this.options = this.options.filter(el => el.ville != this.trajet.villeD);
    this.http.get("http://api.openweathermap.org/geo/1.0/direct?q=" + this.trajet.villeD + ",MA&appid=e53301e27efa0b66d05045d91b2742d3").subscribe(
      data => {
        this.villeD.lat = data[0].lat;
        this.villeD.lon = data[0].lon;
        if (Object.keys(this.villeD).length == 2 && Object.keys(this.villeA).length == 2 && this.trajet.nbrePlace && this.trajet.car) {
          this.getDistance();
        }
      }
    )
  }
  selectionChanged2($event) {
    this.showError = false;
    this.trajet.villeA = $event.value.ville;
    this.options = this.options2;
    this.options = this.options.filter(el => el.ville != this.trajet.villeA);
    this.http.get("http://api.openweathermap.org/geo/1.0/direct?q=" + this.trajet.villeA + ",MA&appid=e53301e27efa0b66d05045d91b2742d3").subscribe(
      data => {
        this.villeA.lat = data[0].lat;
        this.villeA.lon = data[0].lon;
        if (Object.keys(this.villeD).length == 2 && Object.keys(this.villeA).length == 2&& this.trajet.nbrePlace && this.trajet.car) {
          this.getDistance();
        }
      }
    )
  }
  selectionChanged3($event) {
    console.log($event.value);
    var input = document.getElementById("nbrePlace");
    input.setAttribute("max", $event.value.nbrePlace);
  }


  onSearch(data: any) {
    this.showError = false;
    this.showSuccess = false;
    if (data.villeD.length == 0 || data.villeA.length == 0 || data.car.length == 0) {
      this.showError = true;
      this.errorText = "Verifier les informations donnés";
    } else {
      this.showSpinner=true;
      this.service.post("/user/addTrajet",data).subscribe(
        res=>{
          this.showSpinner=false;
          this.showSuccess=true;
          this.initTrajet();
        }, err => {
          this.showError = true;
          this.errorText = "Error lors de l'ajout";
          this.showSpinner=false;
      }
      )
    }
  }

  getDistance() {
    this.http.get("https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=" + this.villeD.lat + "," + this.villeD.lon + "&destinations=" + this.villeA.lat + "," + this.villeD.lon + "&travelMode=driving&key=Aq3iOntrQ2c51_IkDfd4p02TlaMUhYFSssc_nTImw4OE8FMuVOakwJeLkILGywGY").
      subscribe(
        data => {
          var input = document.getElementById("prix");
          var distance=data["resourceSets"][0].resources[0].results[0].travelDistance;
          input.setAttribute("max", (distance/this.trajet.nbrePlace).toString());
        }
      )
  }

  checkOthers() {

  }
}
