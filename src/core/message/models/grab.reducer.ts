import { createSlice } from "@reduxjs/toolkit";
import { Message } from "./message.model";
import { GrabMessageFailure, grabMessage } from "../usecases/grab-message.usecase";
import { RootState } from "../../create-core.store";

export type GrabState = {
    wasLoading: boolean
    lastMessage?: Message,
    wasNotGrabbed: { [depositId: string]: string; };
};
export const initialState : GrabState = {wasLoading: false, wasNotGrabbed: {}}
export const grabSlice = createSlice({
    name: "grab",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(grabMessage.pending, (state) => {
            state.wasLoading = true
         })
        .addCase(grabMessage.fulfilled, (state, action) => {
           state.lastMessage =  {content: action.payload.content}
           state.wasLoading = false
        })
        .addCase(grabMessage.rejected, (state, action) => {
            const payload = action.payload as GrabMessageFailure
            state.wasNotGrabbed[payload.depositId] = payload.failWith
            state.wasLoading = false
         })

        
    }
})

export const selectLastGrabbedMessage = (state: RootState): Message | undefined =>{
    return state.grab.lastMessage
}

export const selectGrabFailure = (state: RootState, depositId: string): string | undefined =>{
    return state.grab.wasNotGrabbed[depositId]
}