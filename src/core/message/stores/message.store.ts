import { signal } from "@preact/signals-react";
import { Dependencies } from "../../create-core.store";
import { DropMessageReceipt } from "../models/drop-message-receipt.model";
import { Params, createDropAnonymousMessage } from "../usecases/drop-message.usecase";
import { Err } from "../../common/models/err.model";

export class MessageStore{
    droppedReceipts = signal<DropMessageReceipt[]>([]);
    errors = signal<Err[]>([]);
    constructor(private deps: Dependencies){}
    async drop(params: Params){
        return createDropAnonymousMessage(this.deps)(params)
            .then((response)=>this.onMessageWasDropped({id: response.receipt, validUntil: response.validUntil, droppedAt: response.at}))
            .catch((e)=>this.onDropMessageError(e))
    }
    onMessageWasDropped(receipt: DropMessageReceipt){
        this.droppedReceipts.value.push(receipt)
    }
    onDropMessageError(err: Err){
        this.errors.value.push(err)
    }
}
