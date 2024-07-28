import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {}

  login(email: string, password: string) {
    const LoggedInDate = new Date(); // Capture the current date and time of login

    return this.afAuth.signInWithEmailAndPassword(email, password).then(
      async (res: any) => {
        localStorage.setItem('userId', res.user.uid);
        localStorage.setItem('token', await res.user.getIdToken());
  
        if (!res.user?.emailVerified) {
          return new Promise<any>((resolve, reject) => {
            this.afs
              .collection('users', (ref) => ref.where('email', '==', email))
              .valueChanges()
              .subscribe(
                (users) => {
                  const userData = users[0] as User;
                  if (userData) {
                    localStorage.setItem('roles', userData.role);
                    this.updateLoggedInDate(res.user.uid, LoggedInDate); // Update logged in date with captured time
                    resolve(userData);
                  } else {
                    reject(new Error('User data not found'));
                  }
                },
                (error) => {
                  reject(error);
                }
              );
          });
        } else {
          throw new Error('Email not verified');
        }
      },
      (error) => {
        console.error('Login error:', error.message);
        throw error;
      }
    );
  }

  async loginDealer(email: string) {
    const LoggedInDate = new Date(); // Capture the current date and time of login

    try {
      const dealersSnapshot = await this.afs
        .collection('dealers', ref => ref.where('email', '==', email))
        .get()
        .toPromise();

      if (!dealersSnapshot.empty) {
        const dealerData = dealersSnapshot.docs[0].data() as User;
        localStorage.setItem('userId', dealerData.uid);
        localStorage.setItem('roles', 'Dealer');
        this.updateLoggedInDate(dealerData.uid, LoggedInDate); // Update logged in date with captured time
        return dealerData;
      } else {
        throw new Error('Dealer data not found');
      }
    } catch (error) {
      console.error('Dealer login error:', error.message);
      throw error;
    }
  }

  register(email: string, password: string): Promise<User> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // Set user data in Firestore
        const userData: User = {
          uid: result.user.uid,
          email: email,
          role: this.getRoleFromEmail(email),
        };
        this.setUserData(result.user, userData);
        return userData; // Return user data after setting in Firestore
      })
      .catch((error) => {
        console.error('Registration error:', error.message);
        throw error;
      });
  }

  setUserData(user: any, userData: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    return userRef.set(userData, {
      merge: true, // update fields without overwriting
    });
  }

  getUserData(userId: string): Observable<User | undefined> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${userId}`);
    return userRef.valueChanges();
  }

  getDealerByEmail(email: string): Observable<any> {
    return this.afs.collection('dealers', ref => ref.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any; // Cast data to any type
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getRoleFromEmail(email: string): 'Admin' | 'Dealer' {
    return email === 'admin@gmail.com' ? 'Admin' : 'Dealer';
  }

  logout() {
    return this.afAuth.signOut().then(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('roles');
        this.router.navigate(['/sign-in']);
      },
      (error) => {
        console.error('Logout error:', error.message);
      }
    );
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getRoles(): string | null {
    return localStorage.getItem('roles');
  }

  public roleMatch(allowedRoles: Array<string>): boolean {
    const userRole = this.getRoles();
    return allowedRoles.includes(userRole!);
  }

  getUser(): string | null {
    return localStorage.getItem('userId');
  }

  updateLoggedInDate(uid: string, LoggedInDate: Date) {
    const formattedDate = `${this.formatTwoDigits(LoggedInDate.getDate())}.${this.formatTwoDigits(LoggedInDate.getMonth() + 1)}.${LoggedInDate.getFullYear()} ${this.formatTwoDigits(LoggedInDate.getHours())}:${this.formatTwoDigits(LoggedInDate.getMinutes())}:${this.formatTwoDigits(LoggedInDate.getSeconds())}`;

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    return userRef.update({
      LoggedInDate: formattedDate,
    });
  }

  private formatTwoDigits(n: number) {
    return n < 10 ? '0' + n : n.toString();
  }
}
