import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class FailureMessageGateway implements MessageGateway{
    private _willRejectWith!: Error;

    willRejectWith(error: Error){
        this._willRejectWith = error
    }
    dropAnonymous(_: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        return Promise.reject(this._willRejectWith)
    }
    
}