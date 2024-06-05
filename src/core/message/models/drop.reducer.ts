import { EntityState, createSlice } from "@reduxjs/toolkit";
import { Deposit, depositAdapter } from "./drop-message-receipt.model";
import { DropMessageFailure, dropMessage, } from "../usecases/drop-message.usecase";
import { RootState } from "../../create-core.store";

export type DropState = {
    wasDropped: { [messageId: string]: string };
    deposits: EntityState<Deposit, string>
    wasNotDropped: { [messageId: string]: string };
    wasLoading: boolean
    lastDeposit?: string
};
export const initialState : DropState = {wasDropped: {},  wasLoading: false, wasNotDropped: {}, deposits: {entities: {}, ids: []}}
export const dropSlice = createSlice({
    name: "drops",
    initialState,
    reducers: {
        clearLastDeposit(state){
            state.lastDeposit = undefined
            state.wasNotDropped = {}
        }
    },
    extraReducers(builder) {
        builder
         .addCase(dropMessage.pending, (state) => {
            state.wasLoading = true
        })
         .addCase(dropMessage.fulfilled, (state, action) => {
            const deposit : Deposit = {
                id: action.payload.receipt, 
                at: action.payload.at,
                validUntil: action.payload.validUntil
            }
            state.wasDropped[action.payload.message] = deposit.id
            depositAdapter.addOne(state.deposits, deposit)
            state.wasLoading = false
            state.lastDeposit = deposit.id
        })
        .addCase(dropMessage.rejected, (state, action) => {
            const payload = action.payload as DropMessageFailure
            state.wasNotDropped[payload.messageId] = payload.failWith
            state.wasLoading = false
            
        })
    }
})

export const selectLastDeposit = (state: RootState): Deposit | null=>{
    if (!state.drop.lastDeposit) return null
    return  depositAdapter.getSelectors().selectById(state.drop.deposits, state.drop.lastDeposit)
}

export const selectHasDropMessageError = (state: RootState): boolean =>{
    return Object.keys(state.drop.wasNotDropped).length > 0
}