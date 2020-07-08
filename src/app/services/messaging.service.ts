import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';


@Injectable()
export class MessagingService {
  private messageing = firebase.messaging();
  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor(private afs: AngularFirestore) { }

  getPermission(user) {

    // console.log('Line 17');
    // console.log(user);
    this.messageing.requestPermission()
      .then(() => {
        // console.log('Notification permission granted.');
        // console.log(this.messageing.getToken());
        return this.messageing.getToken();
      })
      .then(token => this.saveToken(user, token))
      .catch(err => console.log(err, 'Unable to get permission'));
  }

  monitorRefresh(user) {
    this.messageing.onTokenRefresh(() => {
      this.messageing.getToken()
        .then(refreshedToken => this.saveToken(user, refreshedToken))
        .catch(err => console.log(err, 'Unable to get permission'));
    });
  }

  receiveMessage() {
    this.messageing.onMessage(payload => {
      // console.log('Message received! ', payload);
      this.messageSource.next(payload);
    });
  }

  private saveToken(user, token): void {
    const currentTokens = user.fcmTokens || {};
    // console.log(currentTokens, token);

    // if token does not exist in firestore, update db
    if (!currentTokens[token]) {
        const userRef = this.afs.collection('users').doc(user.id);
        const tokens = { ...currentTokens, [token]: true };
        userRef.update({ fcmTokens: tokens });
    }
  }

}
