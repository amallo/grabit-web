
import { FetchHttpGateway } from "./common/gateways/fetch/fetch-http.gateway"
import { NanoIdGenerator } from "./common/gateways/nanoid.generator"
import { RealDateProvider } from "./common/gateways/real-date.provider"
import { RootState, createStore } from "./create-core.store"
import { HttpMessageGateway } from "./message/gateways/http.message.gateway"

export const createAppStore = (preloadedState: RootState)=>{
    return createStore({
        dateProvider: new RealDateProvider(),
        idGenerator: new NanoIdGenerator(),
        messageGateway: new HttpMessageGateway(new FetchHttpGateway(''))
    }, preloadedState)
}