import { Dependencies } from "../../create-core.store"
import { makeErr } from "../../common/models/err.model"
import { Message } from "../models/message.model"
import { createAppAsyncThunk } from "../../create-core-thunk"

/**
 * @deprecated
 * @param deps 
 * @returns 
 */
export const createGrabMessage = (deps: Dependencies)=>{
    return async (receiptId: string): Promise<Message>=>{
        try{
            return await deps.messageGateway.grab(receiptId)
        }
        catch(e){
            console.error("createGrabMessage", e)
            throw makeErr("GRAB_MESSAGE_ERROR", "GATEWAY_ERROR", e as Error)
        }
    }
}


export const grabMessage = createAppAsyncThunk(
    "messages/grab",
    async (
      {receipt}: { receipt: string },
      { extra: { messageGateway }, rejectWithValue }
    ) => {
        try{
            return await messageGateway.grab(receipt)
        }
        catch(e){
            console.error("createGrabMessage", e)
            return rejectWithValue(makeErr("GRAB_MESSAGE_ERROR", "GATEWAY_ERROR", e as Error))
        }
    }
  );
  