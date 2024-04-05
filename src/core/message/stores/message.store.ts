import { signal } from "@preact/signals-react";
import { Dependencies } from "../../create-store";
import { DropMessageReceipt } from "../models/drop-message-receipt.model";
import { Params, createDropAnonymousMessage } from "../usecases/drop-message.usecase";
import { Err } from "../../error/models/err.model";

export class MessageStore{
    private _droppedReceipts = signal<DropMessageReceipt[]>([]);
    private _dropErrors = signal<Err[]>([]);
    constructor(private deps: Dependencies){}
    async drop(params: Params){
        return createDropAnonymousMessage(this.deps)(params)
            .then((response)=>this.onMessageWasDropped({id: response.receipt, validUntil: response.validUntil, droppedAt: response.at}))
            .catch((e)=>this.onDropMessageError(e))
    }
    get droppedReceipts(){
        return this._droppedReceipts
    }
    get dropErrors(){
        return this._dropErrors
    }
    onMessageWasDropped(receipt: DropMessageReceipt){
        this._droppedReceipts.value.push(receipt)
    }
    onDropMessageError(err: Err){
        this._dropErrors.value.push(err)
    }
}
