import { User } from './../interface/user';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class ChatroomService {

  public chatrooms: Observable<any>;
  public changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public selectChatroom: Observable<any>;
  public selectChatroomMesaages: Observable<any>;

  constructor(private db: AngularFirestore,
      private authService: AuthService,
      private afauth: AngularFireAuth,
      private loadingService: LoadingService,
      ) {

    this.selectChatroom = this.changeChatroom.switchMap(chatroomId => {
      if (chatroomId) {
        // tslint:disable-next-line:max-line-length
        return db.doc(`users/${this.afauth.auth.currentUser.uid}/chatrooms/${chatroomId}`).valueChanges();
      }
      return Observable.of(null);
    });

    this.selectChatroomMesaages = this.changeChatroom.switchMap(chatroomId => {
      if (chatroomId) {
        return db.collection(`chatrooms/${chatroomId}/messages`, ref => {
          return ref.orderBy('createdAt', 'desc').limit(100);
        })
        .valueChanges()
        .map(arr => arr.reverse());
      }
      return Observable.of(null);
    });

    this.chatrooms = db.collection(`users/${this.afauth.auth.currentUser.uid}/chatrooms`).valueChanges();
  }

  createMessage(text: string) {
    const chatroomId = this.changeChatroom.value;
    const message = {
      message: text,
      createdAt: new Date(),
      sender: this.authService.currentUserSnapshot
    };

    this.db.collection(`chatrooms/${chatroomId}/messages`).add(message);
  }


  addNewChatRoom(userInfo: User) {
    const chatroomId = userInfo.id;
    const receverUserInformation = {
      id: `${chatroomId}_${this.afauth.auth.currentUser.uid}`,
      name: `${this.authService.currentUserSnapshot.firstName} ${this.authService.currentUserSnapshot.lastName}`, // janki ray
      sent: 0
    };

    const senderUserInformation = {
      id: `${chatroomId}_${this.afauth.auth.currentUser.uid}`,
      name: `${userInfo.firstName} ${userInfo.lastName}`, // janki ray
      sent: 1
    };

    // tslint:disable-next-line:max-line-length
    const currentUserRef = this.db.doc(`users/${this.afauth.auth.currentUser.uid}/chatrooms/${chatroomId}_${this.afauth.auth.currentUser.uid}`);
    const senderUserRef = this.db.doc(`users/${chatroomId}/chatrooms/${chatroomId}_${this.afauth.auth.currentUser.uid}`);
    currentUserRef.set(senderUserInformation);
    senderUserRef.set(receverUserInformation);
  }
}
