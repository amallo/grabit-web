import { Dependencies } from "../../create-store"
import {  DropMessageResponse } from "../gateways/message.gateway"

export type Params = {
    content: string
}
export type Result = {
    receipt: string
    validUntil: string
    at: string
}
export const createDropAnonymousMessage = (deps: Dependencies)=>{
    return async (params: Params): Promise<Result>=>{
        const messageIdentifier =  deps.idGenerator.generate()
        const now = deps.dateProvider.now()
        const response = await deps.messageGateway.dropAnonymous({id: messageIdentifier, content: params.content, at: now})
        return  {receipt: response.receipt, at: now, validUntil: response.validUntil }
    }
}