import { batch, computed, signal } from "@preact/signals-react";
import { Dependencies } from "../../create-core.store";
import { DropMessageReceipt } from "../models/drop-message-receipt.model";
import { Params, Result, createDropAnonymousMessage } from "../usecases/drop-message.usecase";
import { Err } from "../../common/models/err.model";

export class MessageStore{
    readonly receiptsByMessage = signal<Record<string, DropMessageReceipt>>({});
    readonly errors = signal<Err[]>([]);
    readonly lastMessageId = signal<string|null>(null);
    readonly lastReceipt = computed(()=> this.receiptsByMessage.value[this.lastMessageId.value||''])
    constructor(private readonly deps: Dependencies){}
    async drop(params: Params){
        return createDropAnonymousMessage(this.deps)(params)
            .then((result)=>this.onMessageWasDropped(result))
            .catch((e)=>this.onDropMessageError(e))
    }
    onMessageWasDropped(result: Result){
        return batch(()=>{
            this.lastMessageId.value = result.message
            this.receiptsByMessage.value[result.message] = {droppedAt: result.at, id: result.receipt, validUntil: result.validUntil }  
        })
    }
    onDropMessageError(err: Err){
        this.errors.value.push(err)
    }
}
