import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

interface CartItem {
  part: any;
  mechanic: any;
  quantity: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mechanics: any[] = [];
  parts: any[] = [];
  user: User | null = null;
  dealerId: string | null = null;
  selectedMechanic: any = null;
  cartItems: CartItem[] = [];

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUser();
    if (userId) {
      this.authService.getUserData(userId).subscribe(user => {
        this.user = user;
        if (this.user?.role === 'Dealer') {
          this.fetchDealerId();
        }
      }, error => {
        console.error('Error fetching user data:', error);
      });
    } else {
      console.error('User ID not found.');
    }

    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  private fetchDealerId(): void {
    if (this.user?.email) {
      this.authService.getDealerByEmail(this.user.email).subscribe(dealers => {
        if (dealers.length > 0) {
          this.dealerId = dealers[0].id;
          this.fetchMechanics();
          this.fetchParts();
        } else {
          console.error('No dealer found with the given email.');
        }
      }, error => {
        console.error('Error fetching dealer data:', error);
      });
    }
  }

  private fetchMechanics(): void {
    if (this.dealerId) {
      this.afs.collection('mechanics', ref => ref.where('dealerId', '==', this.dealerId))
        .valueChanges().subscribe((mechanics: any[]) => {
          this.mechanics = mechanics;
        }, error => {
          console.error('Error fetching mechanics:', error);
        });
    }
  }

  private fetchParts(): void {
    if (this.dealerId) {
      this.afs.collection('parts', ref => ref.where('dealerId', '==', this.dealerId))
        .valueChanges().subscribe((parts: any[]) => {
          this.parts = parts;
        }, error => {
          console.error('Error fetching parts:', error);
        });
    }
  }

  addToCart(part: any, mechanic: any, quantity: number): void {
    this.cartService.addToCart(part, mechanic, quantity);
  }

  completeTransaction(): void {
    this.cartService.completeTransaction();
    
  }

  incrementQuantity(part: any): void {
    part.quantity = part.quantity ? part.quantity + 1 : 1;
  }

  decrementQuantity(part: any): void {
    if (part.quantity && part.quantity > 0) {
      part.quantity--;
    }
  }
}
