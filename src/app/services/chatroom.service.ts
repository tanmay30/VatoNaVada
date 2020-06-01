import { User } from './../interface/user';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChatroomService {

  public chatrooms: Observable<any>;
  public changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public selectChatroom: Observable<any>;
  public selectChatroomMesaages: Observable<any>;

  constructor(private db: AngularFirestore,
      private authService: AuthService,
      private loadingService: LoadingService,
      ) {

    this.selectChatroom = this.changeChatroom.switchMap(chatroomId => {
      if (chatroomId) {
        return db.doc(`chatrooms/${chatroomId}`).valueChanges();
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

    this.chatrooms = db.collection('chatrooms').valueChanges();
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
    const userInformation = {
      id: chatroomId,
      name: `${userInfo.firstName} ${userInfo.lastName}`
    };
    const userRef = this.db.doc(`chatrooms/${chatroomId}`);
    userRef.set(userInformation);
  }

}
