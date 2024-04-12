import {  Dependencies, createCoreStore } from "./core/create-core.store";


export const createAppStore = (dependencies: Dependencies)=>{
    const coreStore = createCoreStore(dependencies)
    return coreStore
}

export type AppStore = ReturnType<typeof createAppStore>