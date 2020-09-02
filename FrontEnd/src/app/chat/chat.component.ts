import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHandler,
  HttpClientModule,
} from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  userid: string;

  user: String;

  messageText: String;
  chatArray: Array<{ user: String; message: String }> = [];

  constructor(private _chatService: ChatService, private http: HttpClient) {
    this._chatService
      .newUserJoined()
      .subscribe((data) => this.chatArray.push(data));

    this._chatService
      .userLeftRoom()
      .subscribe((data) => this.chatArray.push(data));

    this._chatService
      .newMessageReceived()
      .subscribe((data) => this.chatArray.push(data));
  }

  sendMessage() {
    this._chatService.sendMessage({
      user: this.user,
      message: this.messageText,
    });

    this.messageText = '';
  }
  userInfo;
  load() {
    this.http
      .get<[{ creator: String; content: String }]>('http://localhost:3000/chat')
      .subscribe((data) => {
        data.forEach((element) => {
          let { creator: user, content: message } = element;
          // console.log(element);
          this.chatArray.push({ user, message });
        });
        console.log(this.chatArray);
      });
  }
  ngOnInit() {
    // this._chatService.getmessage().subscribe(data=>this.messageArray.push(data) );

    console.log(this.chatArray);

    this.user = localStorage.getItem('name');
    this._chatService.joinRoom({ user: this.user });

    this.userid = localStorage.getItem('userId');
  }
}
