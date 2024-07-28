import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DealerService } from 'src/app/services/dealer.service';
import { MechanicService } from 'src/app/services/mechanic.service';
import { PartsService } from 'src/app/services/parts.service';
import { Dealer } from 'src/app/interfaces/dealer';
import { Mechanic } from 'src/app/interfaces/mechanic';
import { Parts } from 'src/app/interfaces/parts';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  dealers$: Observable<Dealer[]>;
  mechanics$: Observable<Mechanic[]>;
  parts$: Observable<Parts[]>;
  summary$: Observable<any[]>;

  constructor(
    private dealerService: DealerService,
    private mechanicService: MechanicService,
    private partService: PartsService
  ) {
    this.dealers$ = this.dealerService.getDealers();
    this.mechanics$ = this.mechanicService.getMechanics();
    this.parts$ = this.partService.getParts();

    this.summary$ = combineLatest([this.dealers$, this.mechanics$, this.parts$]).pipe(
      map(([dealers, mechanics, parts]) => {
        return dealers.map(dealer => {
          const dealerMechanics = mechanics.filter(mechanic => mechanic.dealerId === dealer.id);
          const dealerParts = parts.filter(part => part.dealerId === dealer.id);
          return {
            ...dealer,
            mechanicCount: dealerMechanics.length,
            partCount: dealerParts.length,
            mechanics: dealerMechanics,
            parts: dealerParts
          };
        });
      })
    );
  }

  ngOnInit(): void {}
}
