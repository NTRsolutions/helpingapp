import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {map} from 'rxjs/operators';

import { ChatscreenPage } from '../chatscreen/chatscreen';
import { ApiProvider } from '../../../providers/api/api';
@Component({
  selector: 'page-chatslist',
  templateUrl: 'chatslist.html'
})
export class ChatslistPage  implements OnInit{

  chats;
  length=[];
  constructor(public navCtrl: NavController, private api: ApiProvider) {

  } 
  
 chatscreen(item){
  this.navCtrl.push(ChatscreenPage,{
    senderId: item.senderId,
    name: item.senderName,
    image: item.senderImage
  });
  }

  ngOnInit(){
    this.getData(localStorage.getItem('wid'));
  }

  getData(id){
    this.api.getReceiverChats(id)
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res => {
        this.chats = res;
        let x = 0;
        this.chats.forEach(a => {
          this.length[x] = a.messages.length - 1 ;
          x++;
        });
        console.log(this.length);
      })
  }


}
