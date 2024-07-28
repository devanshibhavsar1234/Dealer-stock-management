import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parts } from 'src/app/interfaces/parts';

interface CartItem {
  part: Parts;
  mechanic: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);

  constructor(private afs: AngularFirestore) {}

  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(part: Parts, mechanic: any, quantity: number) {
    if (quantity <= 0) return;
    const existingItem = this.cartItems.find(item => item.part.id === part.id && item.mechanic.id === mechanic.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ part, mechanic, quantity });
    }
    this.cartItemsSubject.next(this.cartItems);
  }

  completeTransaction() {
    const updates = this.cartItems.map(item => {
      const partRef = this.afs.collection('parts').doc(item.part.id);
      return partRef.get().pipe(
        map(doc => {
          const partData = doc.data() as Parts;
          const currentQuantity = partData?.stockQuantity || 0;
          const newQuantity = currentQuantity - item.quantity;
          return partRef.update({ stockQuantity: newQuantity });
        })
      );
    });

    forkJoin(updates).subscribe(() => {
      this.cartItems = [];
      this.cartItemsSubject.next(this.cartItems);
      alert('Transaction completed successfully!');
    }, error => {
      console.error('Error completing transaction:', error);
      alert('Error completing transaction. Please try again.');
    });
  }

  clearCart() {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
  }
}
