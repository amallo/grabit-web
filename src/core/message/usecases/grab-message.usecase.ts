import { Dependencies } from "../../create-core.store"
import { makeErr } from "../../common/models/err.model"
import { Message } from "../models/message.model"

export const createGrabMessage = (deps: Dependencies)=>{
    return async (receiptId: string): Promise<Message>=>{
        try{
            return await deps.messageGateway.grab(receiptId)
        }
        catch(e){
            console.log("createGrabMessage", e)
            throw makeErr("GRAB_MESSAGE_ERROR", "GATEWAY_ERROR", e as Error)
        }
    }
}