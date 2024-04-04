import { signal } from "@preact/signals-react";
import { MessageGateway } from "./message/gateways/message.gateway";
import { DropReceipt } from "./message/models/drop-receipt.model";
import { DateProvider } from "./message/gateways/date.prodivder";

export type Dependencies = {
    messageGateway: MessageGateway
    dateProvider: DateProvider
}
export class Store{
    constructor(private _message: MessageStore){}
    get message() : MessageStore {
        return this._message
    }
}
export const createStore=()=>{
    const messageStore = new MessageStore()
    return  new Store(messageStore)
}

export class MessageStore{
    private _droppedReceipts = signal<DropReceipt[]>([]);
    get droppedReceipts(){
        return this._droppedReceipts
    }
    messageWasDroppedWithReceipt(receipt: DropReceipt){
        this._droppedReceipts.value.push(receipt)
    }
}
