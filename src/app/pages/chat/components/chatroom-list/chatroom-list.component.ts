
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ChatroomService } from '../../../../services/chatroom.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../../../services/auth.service';
import { GetUsersService } from '../../../../services/get-users.service';


@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.scss']
})
export class ChatroomListComponent implements OnInit {
  modalRef: BsModalRef;
  private subscriptions: Subscription[] = [];
  public allUser: any;

  constructor(public chatroomService: ChatroomService,
    private modalService: BsModalService,
      private authService: AuthService,
      private getusers: GetUsersService) { }

  ngOnInit() {
    this.getusers.getAllUser().subscribe(allUsers => {
      this.allUser = allUsers;
    });
  }

  openCreateRoomModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  addNewChatRoom(user) {
    console.log(user);
    this.chatroomService.addNewChatRoom(user);
    this.modalRef.hide();
  }
}
