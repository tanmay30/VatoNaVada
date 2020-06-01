import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../interface/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class GetUsersService {
  public getUser: Observable<User | null>;

  constructor(
    private afauth: AngularFireAuth,
    private db: AngularFirestore) { }


    getAllUser() {
      return this.db.collection('users').valueChanges();
    }

}
