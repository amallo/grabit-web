
import { FetchHttpGateway } from "./common/gateways/fetch/fetch-http.gateway"
import { NanoIdGenerator } from "./common/gateways/nanoid.generator"
import { RealDateProvider } from "./common/gateways/real-date.provider"
import { RootState, createStore } from "./create-core.store"
import { HttpMessageGateway } from "./message/gateways/http.message.gateway"
import { InMemoryMessageGateway } from "./message/gateways/in-memory.message.gateway"
import { LocalStorageMessageGateway } from "./message/gateways/local-storage.message.gateway"

export const createAppStore = (preloadedState: RootState)=>{
    console.log("MODE", process.env.NODE_ENV)
    // development
    const isDev = process.env.NODE_ENV === 'development'

    return createStore({
        dateProvider: new RealDateProvider(),
        idGenerator:new NanoIdGenerator(),
        messageGateway: 
            isDev ?
                 new LocalStorageMessageGateway(new InMemoryMessageGateway(1, new NanoIdGenerator(), 200)) :
                new HttpMessageGateway(new FetchHttpGateway(''))
    }, preloadedState)
}