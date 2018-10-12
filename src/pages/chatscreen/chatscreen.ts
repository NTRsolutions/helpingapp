import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import {map} from 'rxjs/operators';

@Component({
  selector: 'page-chatscreen',
  templateUrl: 'chatscreen.html'
})
export class ChatscreenPage implements OnInit {
  
  workerId;
  workerName;
  workerService;
  image;
  chat;
  userId;
  msgList;
  newMsg;
  chatId;
  newChat: boolean = false;
  customer;

  constructor(public navCtrl: NavController, private navParams: NavParams, private api: ApiProvider) {
    this.workerId = this.navParams.get('workerId');
    this.workerName = this.navParams.get('name');
    this.image = this.navParams.get('image');
    this.userId = localStorage.getItem('uid');
  }
  
  ngOnInit(){
    this.checkPreviousMessages(localStorage.getItem('uid'));
    this.getData(localStorage.getItem('uid'));
  }

  getData(id){
    this.api.getUserData(id)
      .pipe(map(actions => {
        const data = actions.payload.data();
        const did = actions.payload.id;
        return {did, ...data};
      }))
      .subscribe(res => {
        this.customer = res;
      })
  }

  checkPreviousMessages(id){
    this.api.checkChatIfExistsWorker(this.workerId,id)
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res => {

        if(res.length !== 0){         
          this.chat = res[0];
          this.msgList = this.chat.messages;
          this.chatId = this.chat.did;
        }
        else{
          this.newChat= true;
          this.chat= {
            senderId: localStorage.getItem('uid'),
            senderName: this.customer.name,
            senderImage: this.customer.imageURL,
            receiverId: this.workerId,
            receiverName: this.workerName,
            receiverImage: this.image,
            messages: []
          };
        }
      });

  }

  sendMsg(){
    if(this.newChat === false){
      let x = new Date();
      let date = x.toDateString().toString();
      let time = x.getHours()+":"+x.getMinutes();
      let data = {uid: this.userId, message: this.newMsg, time: `${date}, ${time}`};
      this.newMsg = '';
      this.chat.messages.push(data);
      this.api.updateChat(this.chatId,this.chat);
    }
    else if(this.newChat === true){
      let x = new Date();
      let date = x.toDateString().toString();
      let time = x.getHours()+":"+x.getMinutes();
      let data = {uid: this.userId, message: this.newMsg, time: `${date}, ${time}`};
      this.newMsg = '';
      this.chat.messages.push(data);
      this.api.createChat(this.chat)
        .then(res => {
          this.newChat = false;
          this.checkPreviousMessages(localStorage.getItem('uid'));
        });
    }      
  }

}
