
import { Component, OnInit, TemplateRef } from '@angular/core';
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
export class ChatroomListComponent implements OnInit {
  modalRef: BsModalRef;
  private subscriptions: Subscription[] = [];
  public allUser: any;
  public chatroomInfo: any;

  constructor(public chatroomService: ChatroomService,
    private modalService: BsModalService,
    private authService: AuthService,
    private afauth: AngularFireAuth,
    private getusers: GetUsersService) { }

  ngOnInit() {
    this.getusers.getAllUser().subscribe(allUsers => {
      const currentUser = this.afauth.auth.currentUser.uid;
      // allUsers = allUsers.filter(userid => currentUser === )

      allUsers = allUsers.filter(function (user) {
        if (user) {
          return user.id !== currentUser;
        }
      });

      this.allUser = allUsers;
    });

    this.chatroomService.chatrooms.subscribe(chatroom => {
      this.chatroomInfo = chatroom;
    });
  }

  openCreateRoomModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  addNewChatRoom(user) {
    this.chatroomService.addNewChatRoom(user);
    this.modalRef.hide();
  }
}
