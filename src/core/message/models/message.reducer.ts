import { createSlice } from "@reduxjs/toolkit";
import { DropMessageReceipt } from "./drop-message-receipt.model";
import { Message } from "./message.model";
import { grabMessage } from "../usecases/grab-message.usecase";
import { Err } from "../../common/models/err.model";
import { dropMessage } from "../usecases/drop-message.usecase";

export type MessageState = {
    receiptsByMessage: { [messageId: string]: DropMessageReceipt };
    lastMessage?: Message,
    errors: Err[]
};
  
export const messagesSlice = createSlice({
    name: "messages",
    initialState: {} as MessageState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(grabMessage.fulfilled, (state, action) => {
            if (!action.payload) return
            state.errors = []
           state.lastMessage =  {content: action.payload.content}
        })
        .addCase(grabMessage.rejected, (state, action) => {
            state.errors.push(action.payload as Err)
         })

         .addCase(dropMessage.rejected, (state, action) => {
            state.errors.push(action.payload as Err)
         })

         .addCase(dropMessage.fulfilled, (state, action) => {
            if (!action.payload) return
            state.errors = []
            state.receiptsByMessage[action.payload.message] = {
                id: action.payload.receipt, 
                droppedAt: action.payload.at,
                validUntil: action.payload.validUntil
            }
        })
    }
})