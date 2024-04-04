import { Dependencies, Store } from "../../create-store"

export type Params = {
    content: string
}

export const createDropAnonymousMessage = (store: Store, deps: Dependencies)=>{
    return async (params: Params)=>{
        const now = deps.dateProvider.now()
        const response = await deps.messageGateway.dropAnonymous({content: params.content, at: now})
        store.message.messageWasDroppedWithReceipt({id: response.receipt, droppedAt: now, validUntil: response.validUntil })
    }
}
