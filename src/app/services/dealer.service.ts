import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Dealer } from '../interfaces/dealer';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  constructor(private afs: AngularFirestore, private datePipe: DatePipe) { }

  getDealers(): Observable<Dealer[]> {
    return this.afs.collection<Dealer>('dealers').valueChanges({ idField: 'id' });
  }

  addDealer(dealer: Dealer): Promise<void> {
    const id = this.afs.createId();
    dealer.id = id;
    dealer.createdDate = this.datePipe.transform(new Date(), 'dd.MM.yyyy HH:mm:ss') as string;
    return this.afs.collection('dealers').doc(id).set(dealer);
  }

  updateDealer(dealer: Dealer): Promise<void> {
    return this.afs.collection('dealers').doc(dealer.id).update(dealer);
  }

  deleteDealer(id: string): Promise<void> {
    return this.afs.collection('dealers').doc(id).delete();
  }
}
