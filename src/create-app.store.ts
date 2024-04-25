import {  Dependencies, createCoreStore } from "./core/create-core.store";
import { MessageState } from "./core/message/stores/message.store";


export const createAppStore = (dependencies: Dependencies, state?: MessageState)=>{
    const coreStore = createCoreStore(dependencies, state)
    return coreStore
}

export type AppStore = ReturnType<typeof createAppStore>