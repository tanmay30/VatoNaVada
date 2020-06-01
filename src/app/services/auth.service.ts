import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Alert } from '../classes/alert';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs/Observable';
import { AlertType } from './../enums/alert-type.enum';
import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import 'rxjs/add/observable/of';
import { User } from '../interface/user';

@Injectable()
export class AuthService {

  public currentUser: Observable<User | null>;
  public currentUserSnapshot: User | null;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private afauth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.currentUser = this.afauth.authState
      .switchMap((user) => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });

      this.setCurrentUserSnapshot();

   }

  public signup(firstName: string, lastName: string, email: string, password: string): Observable<boolean> {
    return Observable.fromPromise(
      this.afauth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
        const updatedUser = {
          id: user.uid,
          email: user.email,
          firstName,
          lastName,
          // tslint:disable-next-line:max-line-length
          photoUrl: 'https://firebasestorage.googleapis.com/v0/b/vatonavada-37494.appspot.com/o/emoji.png?alt=media&token=1b0a2f65-f284-4c12-9ed3-d42f3f5eda7f',
          quote: '',
          bio: ''
        };
        userRef.set(updatedUser);
        return true;
      })
      .catch((err) => false)
    ) ;
    // return Observable.of(true);
  }


  public login(email: string, password: string): Observable<boolean> {
    return Observable.fromPromise(
      this.afauth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => true)
      .catch((err) => false)
    );
  }

  public logout(): void {
    this.afauth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.alertService.alerts.next(new Alert('You have been signed out.'));
    });
  }

  setCurrentUserSnapshot(): void {
    this.currentUser.subscribe(user => this.currentUserSnapshot = user);
  }

}
