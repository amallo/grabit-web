import { Root } from "react-dom/client";
import { Err } from "./common/models/err.model";
import { RootState } from "./create-core.store";
import { MessageState } from "./message/stores/message.store";

class MessageStateBuilder{
    private errors: Err[] = []
    constructor(private state: MessageState = {errors: [], receiptsByMessage: {}}){}
    appendError(err: Err){
       this.errors.push(err)
       return this
    }
    build(): MessageState{
        return {
            ...this.state,
            errors: [...this.state.errors, ...this.errors]
        }
    }
}
export const createMessageStateBuilder = (state: MessageState = {errors: [], receiptsByMessage: {}})=>{
    return new MessageStateBuilder(state)
}
export class StateBuilder {
    private message?: MessageStateBuilder
    constructor(private state: RootState){}
    withMessage(message: MessageStateBuilder){
        this.message = message
        return this
    }
    build() : RootState{
        return {
            ...this.state,
            message: this.message ? this.message.build() : this.state.message
        }
    }
}
export const createRootStateBuilder = (state: RootState = { message: {errors: [], receiptsByMessage: {}}})=>{
    return new StateBuilder(state)
}