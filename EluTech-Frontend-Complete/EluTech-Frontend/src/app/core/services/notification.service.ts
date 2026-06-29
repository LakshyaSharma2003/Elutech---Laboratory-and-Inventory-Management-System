import { Injectable } from '@angular/core';

@Injectable({

providedIn:'root'

})

export class NotificationService {



connect()
{

console.log(

'SignalR Connected'

);

}



disconnect()
{

console.log(

'Disconnected'

);

}



}