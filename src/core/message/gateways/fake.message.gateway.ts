import { Message } from "../models/message.model";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class FakeMessageGateway implements MessageGateway{
    private _willReturnDropResponse!: DropMessageResponse;
    private _wasDroppedWith!: DropAnonymousMessageRequest;
    private _wasGrabbedWith!: string;
    private _willGrabMessage!: Message;
    willReturnDropResponse(response: DropMessageResponse){
        this._willReturnDropResponse = response
    }
    willGrabMessage(message: Message){
        this._willGrabMessage = message
    }
    wasDroppedAnonymouslyWithRequest(){
        return this._wasDroppedWith
    }
    wasGrabbedWith(){
        return this._wasGrabbedWith
    }
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        this._wasDroppedWith = message
        return Promise.resolve(this._willReturnDropResponse)
    }
    grab(receiptId: string): Promise<Message> {
        this._wasGrabbedWith = receiptId
        return Promise.resolve(this._willGrabMessage)
    }
    
    
}