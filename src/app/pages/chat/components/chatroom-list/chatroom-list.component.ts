
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { ChatroomService } from '../../../../services/chatroom.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../../../services/auth.service';
import { GetUsersService } from '../../../../services/get-users.service';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.scss']
})
export class ChatroomListComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  private subscriptions: Subscription[] = [];
  // public : any;
  // public : any;
  public allUser: any;
  public photoUrl: Observable<any>;


  constructor(public chatroomService: ChatroomService,
    private modalService: BsModalService,
    private authService: AuthService,
    private afauth: AngularFireAuth,
    private getusers: GetUsersService) { }

  ngOnInit() {
    // this.subscriptions.push(
    //   this.chatroomService.userInfoForChatroom.subscribe(info => {
    //   this.photoUrl = info.photoUrl;
    // }));

    this.subscriptions.push(
      this.getusers.getAllUser().subscribe(allUsers => {
        const currentUser = this.afauth.auth.currentUser.uid;
        // allUsers = allUsers.filter(userid => currentUser === )

        allUsers = allUsers.filter(function (user: any) {
          if (user) {
            return user.id !== currentUser;
          }
        });

        this.allUser = allUsers;
    }));
  }

  openCreateRoomModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addNewChatRoom(user) {
    this.chatroomService.addNewChatRoom(user);
    this.modalRef.hide();
  }
}
