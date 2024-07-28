// src/app/services/part.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Parts } from '../interfaces/parts';


@Injectable({
  providedIn: 'root'
})
export class PartsService {

  constructor(private afs: AngularFirestore) { }

  getParts(): Observable<Parts[]> {
    return this.afs.collection<Parts>('parts').valueChanges({ idField: 'id' });
  }

  addPart(part: Parts): Promise<void> {
    const id = this.afs.createId();
    part.id = id;
    part.createdDate = new Date().toISOString();
    return this.afs.collection('parts').doc(id).set(part);
  }

  updatePart(part: Parts): Promise<void> {
    return this.afs.collection('parts').doc(part.id).update(part);
  }

  deletePart(id: string): Promise<void> {
    return this.afs.collection('parts').doc(id).delete();
  }
}
