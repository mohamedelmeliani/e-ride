import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-how-it-works',
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle = [
        {
            title: 'Comment ça fonctionne',
        }
    ]
    howItWorksBox = [
        {
            icon: 'flaticon-placeholder',
            title: 'Trouver Trajet Intéressant',
            paragraph: 'Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
        },
        {
            icon: 'flaticon-support-1',
            title: 'Envoyer Demande',
            paragraph: 'Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
        },
        {
            icon: 'flaticon-tick',
            title: 'Obtenir réponse du propriétaire',
            paragraph: 'Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
        }
    ]

}