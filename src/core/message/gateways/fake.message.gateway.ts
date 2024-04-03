import { MessageGateway, DropAnonymousMessageRequest, MessageTicketResponse } from "./message.gateway";

export class FakeMessageGateway implements MessageGateway{
    private _willReturnTicket!: MessageTicketResponse;
    private _wasDroppedWith!: DropAnonymousMessageRequest;
    willBeDroppedWithTicket(ticket: MessageTicketResponse){
        this._willReturnTicket = ticket
    }
    wasAnonymouslyDroppedWith(){
        return this._wasDroppedWith
    }
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<MessageTicketResponse> {
        this._wasDroppedWith = message
        return Promise.resolve(this._willReturnTicket)
    }
    
}