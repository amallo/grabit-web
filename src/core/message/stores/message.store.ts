
import { Dependencies } from "../../create-core.store";
import { DropMessageReceipt } from "../models/drop-message-receipt.model";
import { Params, Result, createDropAnonymousMessage } from "../usecases/drop-message.usecase";
import { Err } from "../../common/models/err.model";
import { createMutable } from "solid-js/store";
import { batch } from "solid-js";
type State = {
    receiptsByMessage: Record<string, DropMessageReceipt>, 
    errors: Err[], 
    lastMessageId: string|null
    lastReceipt?: DropMessageReceipt
}

export const createMessageStoreWithDeps = (deps: Dependencies)=>{
    return (initialState: State = {
        errors:  [],
        lastMessageId : null,
        receiptsByMessage: {} 
     })=>{
        const state = createMutable<State>({
            ...initialState,
            get lastReceipt() {
                return this.receiptsByMessage[this.lastMessageId||'']
            }
        })
        const onMessageWasDropped = (result: Result)=>{
            return batch(()=>{
                state.lastMessageId = result.message
                state.receiptsByMessage[result.message] = {droppedAt: result.at, id: result.receipt, validUntil: result.validUntil }  
                state.errors = []
            })
        }
        const onDropMessageError = (err: Err)=>{
            state.errors.push(err)
        }
        return {
            selectState(){return state},
            async drop(params: Params){
                try {
                    const result = await createDropAnonymousMessage(deps)(params);
                    return onMessageWasDropped(result);
                } catch (e) {
                    return onDropMessageError(e as Err);
                }
            },
            onDropMessageError,
            selectReceipt(messageId: string){
                return this.selectState().receiptsByMessage[messageId]
            }
        }
    }
}
