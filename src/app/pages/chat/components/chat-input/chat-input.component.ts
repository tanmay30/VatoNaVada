import { ChatroomService } from './../../../../services/chatroom.service';
import { Message } from './../../../../classes/message';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  public newMessageText = '';

  constructor(private chatroomService: ChatroomService) { }

  ngOnInit() {
  }


  public submit(message: string): void {
    this.chatroomService.createMessage(message);


    //reset input
    this.newMessageText ='';
  }

}
