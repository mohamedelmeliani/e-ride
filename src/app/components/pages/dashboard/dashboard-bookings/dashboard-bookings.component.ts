import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
    selector: 'app-dashboard-bookings',
    templateUrl: './dashboard-bookings.component.html',
    styleUrls: ['./dashboard-bookings.component.scss']
})
export class DashboardBookingsComponent implements OnInit {

    assistes:any=[];
    trajets:any=[];
    trajet:any=[];
    showSpinner=true;

    constructor(public service:AuthService) { }

    ngOnInit(): void {
        this.showSpinner=true;
        this.service.get("/user/getHistory").subscribe(
            data=>{
                this.assistes=data;
                this.assistes.forEach(assiste => {
                    this.service.get("/all/findtrajet/"+assiste.key.trajetId).subscribe(
                        res=>{
                            this.trajet=res;
                            this.trajet.infos= [
                                {
                                    icon: 'bx bx-map',
                                    title: 'Ville Depart',
                                    text: this.trajet.villeD,
                                },
                                {
                                    icon: 'bx bx-map',
                                    title: 'Ville Arrivée',
                                    text: this.trajet.villeA,
                                },
                                {
                                    icon: 'bx bx-calendar',
                                    title: 'Date',
                                    text: this.trajet.date,
                                },
                                {
                                    icon: 'flaticon-clock',
                                    title: 'Heure',
                                    text: this.trajet.heure,
                                },
                                {
                                    icon: 'bx bx-group',
                                    title: 'Places',
                                    text: this.trajet.nbrePlace,
                                },
                                {
                                    icon: 'bx bx-purchase-tag',
                                    title: 'Prix',
                                    text: this.trajet.prix,
                                }
                            ]
                            this.trajet.status=assiste.status;
                            this.trajets.push(this.trajet);
                        }
                    )
                });
                this.showSpinner=false;
            }
        )
    }

    breadcrumb = [
        {
            title: 'Historique',
        }
    ]

}