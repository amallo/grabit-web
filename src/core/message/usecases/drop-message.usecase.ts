import { Dependencies } from "../../create-core.store"
import { makeErr } from "../../common/models/err.model"

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