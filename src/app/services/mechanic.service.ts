import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Mechanic } from '../interfaces/mechanic';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  constructor(private afs: AngularFirestore, private datePipe: DatePipe) { }

  getMechanics(): Observable<Mechanic[]> {
    return this.afs.collection<Mechanic>('mechanics').valueChanges({ idField: 'id' });
  }

  addMechanic(mechanic: Mechanic): Promise<void> {
    const id = this.afs.createId();
    mechanic.id = id;
    mechanic.createdDate = this.datePipe.transform(new Date(), 'dd.MM.yyyy HH:mm:ss') as string;
    return this.afs.collection('mechanics').doc(id).set(mechanic);
  }

  updateMechanic(mechanic: Mechanic): Promise<void> {
    return this.afs.collection('mechanics').doc(mechanic.id).update(mechanic);
  }

  deleteMechanic(id: string): Promise<void> {
    return this.afs.collection('mechanics').doc(id).delete();
  }
}
