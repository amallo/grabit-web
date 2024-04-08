import { computed } from "@preact/signals-react";
import { Params } from "./core/message/usecases/drop-message.usecase";
import { AppStore } from "./create-app.store";

export const createDropMessageViewModel = (store: AppStore)=>{
    const hasDropMessageFailure = computed(() => store.core.message.errors.value.length > 0);
    return {
        dropAnonymousMessage(params: Params){
            return store.core.message.drop(params)
        },
        hasDropMessageFailure,
        lastReceipt: store.core.message.lastReceipt,
        lastMessageId : store.core.message.lastMessageId
    }
}