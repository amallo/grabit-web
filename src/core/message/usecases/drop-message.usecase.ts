import { Dependencies } from "../../create-store"
import { makeErr } from "../../error/models/err.model"

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
        const now = deps.dateProvider.now()
        try{
            console.log("deps.messageGateway", deps.messageGateway)
            const response = await deps.messageGateway.dropAnonymous({content: params.content, at: now})
            return  {receipt: response.receipt, at: now, validUntil: response.validUntil }
        }
        catch(e){
            console.log("errror", e)
            throw makeErr("DROP_MESSAGE_ERROR", "GATEWAY_ERROR", e as Error)
        }
    }
}