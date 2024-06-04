
import { Deposit } from "../models/drop-message-receipt.model";
import { Message } from "../models/message.model";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class FakeMessageGateway implements MessageGateway{
    private _wasDroppedWith!: DropAnonymousMessageRequest;
    private _wasGrabbedWith!: string;
    private _willGrabMessage!: Message;

    private _depositsByMessage: Map<string, Deposit> = new Map()
    private _messagesByDeposit: Map<string, Message> = new Map()
    willReturnDepositForMessage(forMessage: string, deposit: Deposit){
        this._depositsByMessage.set(forMessage, deposit)
    }
    willReturnMessageForDeposit(forDeposit: string, message: Message){
        this._messagesByDeposit.set(forDeposit, message)
    }
    willGrabMessage(message: Message){
        this._willGrabMessage = message
    }
    wasDroppedWith(){
        return this._wasDroppedWith
    }
    wasGrabbedWith(){
        return this._wasGrabbedWith
    }
    dropAnonymous(request: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        this._wasDroppedWith = request
        const deposit = this._depositsByMessage.get(request.messageId)
        if (!deposit) return Promise.reject()
        return Promise.resolve({id: deposit.id, at: request.at, validUntil: deposit.validUntil})
    }
    grab(depositId: string): Promise<Message> {
        this._wasGrabbedWith = depositId
        const message = this._messagesByDeposit.get(depositId)
        if (!message) return Promise.reject()
        return Promise.resolve(message)
    }
    
    
}