import { Dependencies } from "../../create-store"
import {  DropMessageResponse } from "../gateways/message.gateway"

export type Params = {
    content: string
}
export type Result = {
    ticket: DropMessageResponse
}
export const createDropAnonymousMessage = (deps: Dependencies)=>{
    return async (params: Params): Promise<Result>=>{
        const messageIdentifier =  deps.idGenerator.generate()
        const ticket = await deps.messageGateway.dropAnonymous({id: messageIdentifier, content: params.content})
        return  {ticket }
    }
}