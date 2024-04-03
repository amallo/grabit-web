import { MessageGateway, DropAnonymousMessageRequest, MessageTicketResponse } from "./message.gateway";

export class FailureMessageGateway implements MessageGateway{
    private _willRejectWith!: Error;

    willRejectWith(error: Error){
        this._willRejectWith = error
    }
    dropAnonymous(_: DropAnonymousMessageRequest): Promise<MessageTicketResponse> {
        return Promise.reject(this._willRejectWith)
    }
    
}