import { batch, computed, signal } from "@preact/signals-react";
import { Dependencies } from "../../create-core.store";
import { DropMessageReceipt } from "../models/drop-message-receipt.model";
import { Params, Result, createDropAnonymousMessage } from "../usecases/drop-message.usecase";
import { Err } from "../../common/models/err.model";

export class MessageState{
    readonly receiptsByMessage = signal<Record<string, DropMessageReceipt>>({});
    readonly errors = signal<Err[]>([]);
    readonly lastMessageId = signal<string|null>(null);
    readonly lastReceipt = computed(()=> this.receiptsByMessage.value[this.lastMessageId.value||''])
    constructor(initial: {
        receiptsByMessage: Record<string, DropMessageReceipt>, 
        errors: Err[], 
        lastMessageId: string|null
    } = {
       errors:  [],
       lastMessageId : null,
       receiptsByMessage: {} 
    }){
        this.receiptsByMessage.value = initial.receiptsByMessage
        this.errors.value = initial.errors
        this.lastMessageId.value = initial.lastMessageId
    }
    onMessageWasDropped(result: Result){
        return batch(()=>{
            this.lastMessageId.value = result.message
            this.receiptsByMessage.value[result.message] = {droppedAt: result.at, id: result.receipt, validUntil: result.validUntil }  
            this.errors.value = []
        })
    }
    onDropMessageError(err: Err){
        this.errors.value.push(err)
    }
    appendPreviousError(err: Err){
        this.errors.value = this.errors.value.concat(err)
    }
}

export class MessageStore{
    constructor(private readonly deps: Dependencies, private readonly state: MessageState = new MessageState()){}
    async drop(params: Params){
        return createDropAnonymousMessage(this.deps)(params)
            .then((result)=>this.onMessageWasDropped(result))
            .catch((e)=>this.onDropMessageError(e))
    }
    onMessageWasDropped(result: Result){
        return this.state.onMessageWasDropped(result)
    }
    onDropMessageError(err: Err){
        this.state.onDropMessageError(err)
    }
    appendPreviousErr(err: Err){
        this.state.appendPreviousError(err)
    }
    get receiptsByMessage(){
        return this.state.receiptsByMessage
    }
    get errors(){
        return this.state.errors
    }
    get lastReceipt(){
        return this.state.lastReceipt
    }
    get lastMessageId(){
        return this.state.lastMessageId
    }
}
