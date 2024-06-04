
import { RootState } from "./create-core.store";
import { Deposit, depositAdapter } from "./message/models/drop-message-receipt.model";
import { GrabState, initialState as initialGrabState } from "./message/models/grab.reducer";
import {  DropState, initialState as initialDropState } from "./message/models/drop.reducer";
import { Message } from "./message/models/message.model";



class GrabStateBuilder{
    private _wasLoading: boolean
    private _lastMessage?: Message;
    private _wasNotGrabbed: { [depositId: string]: string; };
    constructor( private state: GrabState){
        this._wasLoading = state.wasLoading
        this._lastMessage = state.lastMessage
        this._wasNotGrabbed = state.wasNotGrabbed
    }
    withLoading(){
        this._wasLoading = true
        return this
    }
    withNotLoading(){
        this._wasLoading = false
        return this
    }
    withFailure({depositId, failWith} : {depositId: string, failWith: string}){
        this._wasNotGrabbed = {
            ...this._wasNotGrabbed,
            [depositId] : failWith
        }
        return this
    } 
    withLastMessage(message: Message){
        this._lastMessage = message
        return this
    }
    build(): GrabState{
        return {
            ...this.state,
            wasLoading : this._wasLoading,
            lastMessage: this._lastMessage,
            wasNotGrabbed : this._wasNotGrabbed
        }
    }
}
export const grabState = (state: GrabState = initialGrabState)=>{
    return new GrabStateBuilder(state)
}


class DropStateBuilder{
    private _wasLoading: boolean
    private _wasDropped: { [messageId: string]: string; };
    private _wasNotDropped: { [messageId: string]: string; };
    private _deposits : Deposit[] = []
    constructor( private state: DropState){
        this._wasLoading = state.wasLoading
        this._wasDropped = state.wasDropped
        this._wasNotDropped = state.wasNotDropped
    }
    withLoading(){
        this._wasLoading = true
        return this
    }
    withNotLoading(){
        this._wasLoading = false
        return this
    }
    withDeposit({messageId, withDeposit} : {messageId: string, withDeposit: Deposit}){
        this._wasDropped = {
            ...this._wasDropped,
            [messageId] : withDeposit.id
        }
        this._deposits.push(withDeposit)

        return this
    }   
    withFailure({messageId, failWith} : {messageId: string, failWith: string}){
        this._wasNotDropped = {
            ...this._wasNotDropped,
            [messageId] : failWith
        }
        return this
    }   
    build(): DropState{
        return {
            ...this.state,
            wasDropped : this._wasDropped,
            wasLoading : this._wasLoading,
            wasNotDropped : this._wasNotDropped,
            deposits: depositAdapter.addMany(this.state.deposits, this._deposits),
            lastDeposit: this._deposits.length === 0 ? undefined : this._deposits[this._deposits.length - 1].id 
        }
    }
}
export const dropState = (state: DropState = initialDropState)=>{
    return new DropStateBuilder(state)
}
export class StateBuilder {
    private dropState: DropStateBuilder
    private grabState: GrabStateBuilder
    constructor(private state: RootState){
        this.dropState = new DropStateBuilder(state.drop)
        this.grabState = new GrabStateBuilder(state.grab)
    }
    withDropState(builder: DropStateBuilder){
        this.dropState = builder
        return this
    }
    withGrabState(builder: GrabStateBuilder){
        this.grabState = builder
        return this
    }
    build() : RootState{
        return {
            ...this.state,
            drop: this.dropState.build(),
            grab: this.grabState.build()
        }
    }
}
export const rootState = (state: RootState = {  drop: initialDropState, grab: initialGrabState})=>{
    return new StateBuilder(state)
}