import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class FakeMessageGateway implements MessageGateway{
    private _willReturnDropResponse!: DropMessageResponse;
    private _wasDroppedWith!: DropAnonymousMessageRequest;
    willReturnDropResponse(response: DropMessageResponse){
        this._willReturnDropResponse = response
    }
    wasDroppedAnonymouslyWithRequest(){
        return this._wasDroppedWith
    }
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        this._wasDroppedWith = message
        return Promise.resolve(this._willReturnDropResponse)
    }
    
}