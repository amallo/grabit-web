import { Dependencies } from "../../create-core.store";
import { DropMessageReceipt } from "../models/drop-message-receipt.model";
import { Params,  createDropAnonymousMessage } from "../usecases/drop-message.usecase";
import { Err } from "../../common/models/err.model";
import create from "xoid";

export type MessageState = {
    receiptsByMessage: Record<string, DropMessageReceipt>
    errors: Err[]
    lastMessageId?: string
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
        confirmReceipt(messageId: string, receipt: DropMessageReceipt){
            atom.update((state)=>({
                ...state,
                lastMessageId: messageId
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


   const $lastReceipt = create((read)=> read($state).receiptsByMessage[read($state).lastMessageId || '']  )
   
   return {$state, selectors: {$lastReceipt}} 
}
