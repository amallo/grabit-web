import { MessageGateway } from "./message/gateways/message.gateway";
import { IdGenerator } from "./common/gateways/id.generator";
import { FakeIdGenerator } from "./common/gateways/fake-id.generator";
import { FakeMessageGateway } from "./message/gateways/fake.message.gateway";
import { DateProvider } from "./common/gateways/date.prodivder";
import { FakeDateProvider } from "./common/gateways/fake-date.provider";
import { MessageState, createMessageStore } from "./message/stores/message.store";
import { Action, ThunkDispatch, configureStore } from "@reduxjs/toolkit";
import { coreReducer } from "./core.reducer";

export type Dependencies = {
    idGenerator: IdGenerator
    messageGateway: MessageGateway
    dateProvider: DateProvider
}

export const createTestCoreStore=(deps: Dependencies = {
    idGenerator: new FakeIdGenerator(),
    messageGateway: new FakeMessageGateway(),
    dateProvider: new FakeDateProvider()
})=>{
    return createCoreStore(deps)
}
/**
 * @deprecated
 */
export const createCoreStore = (deps: Dependencies, state?: MessageState)=>{
    const messageStore = createMessageStore(deps, state)
    return messageStore
}

export const createTestStore=(deps: Dependencies = {
    idGenerator: new FakeIdGenerator(),
    messageGateway: new FakeMessageGateway(),
    dateProvider: new FakeDateProvider()
}, preloadedState: RootState)=>{
    return createStore(deps, preloadedState)
}

export const createStore = (deps: Dependencies, preloadedState: RootState)=>{
    return configureStore({
        reducer: coreReducer,
        middleware(getDefaultMiddleware) {
            return getDefaultMiddleware({
              thunk: {
                extraArgument: deps,
              },
            })
        },
        preloadedState
    })
}

export type RootState = ReturnType<typeof coreReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, Action>;
export type AppStore = ReturnType<typeof createStore>