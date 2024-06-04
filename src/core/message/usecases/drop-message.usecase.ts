import { createAppAsyncThunk } from "../../create-core-thunk"
import { createAction } from "@reduxjs/toolkit"
export type Params = {
    content: string
}
export type Result = {
    receipt: string
    validUntil: string
    at: string
    message: string
}
export type DropMessageFailure = {messageId:string, failWith: "GATEWAY_ERROR"}
export const dropMessage = createAppAsyncThunk(
    "messages/drop",
    async (
      content: string,
      { extra: { dateProvider, idGenerator, messageGateway }, rejectWithValue }
    ) => {
        const now = dateProvider.now()
        const willGenerateMessageId = idGenerator.generate()
        try{
            const response = await messageGateway.dropAnonymous({content: content, at: now, messageId: willGenerateMessageId})
            return  {receipt: response.id, at: now, validUntil: response.validUntil, message: willGenerateMessageId }
        }
        catch(e){
            return rejectWithValue({messageId:willGenerateMessageId, failWith: "GATEWAY_ERROR"})
        }
    }
  );
  
  export const enterContent = createAction<string>("messages/enter")