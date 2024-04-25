import { Dependencies } from "../../create-core.store";
import { DropMessageReceipt } from "../models/drop-message-receipt.model";
import { Params,  createDropAnonymousMessage } from "../usecases/drop-message.usecase";
import { Err } from "../../common/models/err.model";
import create from "xoid";
import { Message } from "../models/message.model";
import { createGrabMessage } from "../usecases/grab-message.usecase";

export type MessageState = {
    receiptsByMessage: Record<string, DropMessageReceipt>
    errors: Err[]
    lastMessage?: Message
} 

export const createMessageStore = (deps: Dependencies, state: MessageState = {receiptsByMessage: {}, errors: []})=>{
   const $state = create(state, (atom)=>({
        async dropAnonymous(params: Params){
            try{
                const result = await createDropAnonymousMessage(deps)(params);
                const receipt : DropMessageReceipt = { droppedAt: result.at, id: result.receipt, validUntil: result.validUntil }
                this.confirmReceipt(result.message, receipt)
                return receipt
            }
            catch(e){
                this.appendError(e as Err)
            }
        },
        async grab(receiptId: string){
            try{
                const result = await createGrabMessage(deps)(receiptId)
                this.grabbedMessageIs(result)
            }
            catch(e){
                this.appendError(e as Err)
            }
        },
        grabbedMessageIs(message: Message){
            atom.update((state)=>({
                ...state,
                lastMessage: message,
                errors: []
            }))
        },
        confirmReceipt(messageId: string, receipt: DropMessageReceipt){
            atom.update((state)=>({
                ...state,
            }))
            const $receipts = atom.focus(s => s.receiptsByMessage[messageId])
            $receipts.set(receipt)
            const $errors = atom.focus(s => s.errors)
            $errors.update(()=>[])
        },
        appendError(e: Err){
            const $errors = atom.focus(s => s.errors)
            $errors.update((errs)=>[...errs, e as Err])
        }
   }))
   return $state
}
