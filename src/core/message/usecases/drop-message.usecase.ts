import { Dependencies } from "../../create-core.store"
import { makeErr } from "../../common/models/err.model"
import { createAppAsyncThunk } from "../../create-core-thunk"

export type Params = {
    content: string
}
export type Result = {
    receipt: string
    validUntil: string
    at: string
    message: string
}
export const createDropAnonymousMessage = (deps: Dependencies)=>{
    return async (params: Params): Promise<Result>=>{
        const now = deps.dateProvider.now()
        try{
            const willGenerateMessageId = deps.idGenerator.generate()
            const response = await deps.messageGateway.dropAnonymous({content: params.content, at: now, messageId: willGenerateMessageId})
            return  {receipt: response.receipt, at: now, validUntil: response.validUntil, message: willGenerateMessageId }
        }
        catch(e){
            throw makeErr("DROP_MESSAGE_ERROR", "GATEWAY_ERROR", e as Error)
        }
    }
}

export const dropMessage = createAppAsyncThunk(
    "messages/drop",
    async (
      {content}: { content: string },
      { extra: { dateProvider, idGenerator, messageGateway }, rejectWithValue }
    ) => {
        const now = dateProvider.now()
        try{
            const willGenerateMessageId = idGenerator.generate()
            const response = await messageGateway.dropAnonymous({content: content, at: now, messageId: willGenerateMessageId})
            return  {receipt: response.receipt, at: now, validUntil: response.validUntil, message: willGenerateMessageId }
        }
        catch(e){
            return rejectWithValue(makeErr("DROP_MESSAGE_ERROR", "GATEWAY_ERROR", e as Error))
        }
    }
  );
  