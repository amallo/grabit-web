import { CoreStore, Dependencies, createCoreStore } from "./core/create-core.store";

export class AppStore{
    constructor(public readonly coreStore: CoreStore){}
}

export const createAppStore = (dependencies: Dependencies)=>{
    const coreStore = createCoreStore(dependencies)
    return new AppStore(coreStore)
}